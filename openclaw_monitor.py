import sys
import time
import json
import os

def get_system_ticks():
    """獲取整個系統總共消耗的 CPU Ticks"""
    with open("/proc/stat", "r") as f:
        fields = f.readline().split()
        return sum(int(x) for x in fields[1:])

def get_process_ticks(pid):
    """獲取指定 PID 的進程名稱、utime 和 stime"""
    try:
        with open(f"/proc/{pid}/stat", "r") as f:
            stat_line = f.read()
        fields = stat_line.split()

        # 欄位 2 是名字，欄位 14 是 utime，欄位 15 是 stime
        name = fields[1].strip("()")
        utime = int(fields[13])
        stime = int(fields[14])
        return name, utime, stime
    except FileNotFoundError:
        return None, 0, 0

def calculate_cpu(pid, interval=2):
    # 獲取 CPU 核心數做乘數修正
    num_cores = os.cpu_count() or 1

    # 第一次採樣
    sys_start = get_system_ticks()
    proc_info = get_process_ticks(pid)
    if proc_info[0] is None:
        return None
    name, u_start, s_start = proc_info

    # 正常等待 0.5 秒（與後端/前端每半秒更新呼應，且不佔用 CPU 資源）
    time.sleep(interval)

    # 第二次採樣
    sys_end = get_system_ticks()
    _, u_end, s_end = get_process_ticks(pid)

    # 計算差值
    sys_delta = sys_end - sys_start
    if sys_delta == 0:
        return None

    u_delta = u_end - u_start
    s_delta = s_end - s_start

    # 計算百分比（比照 Linux 'top' 標準，單核滿載為 100%）
    cpu_user = round((u_delta / sys_delta) * 100 * num_cores, 2)
    cpu_system = round((s_delta / sys_delta) * 100 * num_cores, 2)
    cpu_total = round(cpu_user + cpu_system, 2)

    return {
        "pid": int(pid),
        "name": name,
        "cpu_total": cpu_total,
        "cpu_user": cpu_user,
        "cpu_system": cpu_system
    }

if __name__ == "__main__":
    # 如果執行時有傳入 PID 參數就用它，沒有就抓自己
    target_pid = sys.argv[1] if len(sys.argv) > 1 else os.getpid()

    result = calculate_cpu(target_pid)

    if result:
        # 直接印出乾淨的 JSON 字串到標準輸出 (stdout)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": f"PID {target_pid} not found"}))
