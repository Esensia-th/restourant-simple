/**
 * @file Logika timer pesanan dan proses 3 detik Restoran Simple (F4).
 * Modul murni: tanpa Three.js, tanpa DOM, tanpa setInterval/setTimeout.
 * Waktu hanya maju lewat selisih waktu (deltaSeconds) dari luar.
 */

export const ORDER_TIME_LIMIT_SECONDS = 30;
export const PROCESS_DURATION_SECONDS = 3;

/** Toleransi kecil agar hitungan desimal tidak meleset. */
const EPSILON = 1e-9;

/**
 * Membuat pesanan baru dengan timer penuh.
 * @param {{ customerNumber: number, menuId: string }} params
 */
export function createOrder({ customerNumber, menuId }) {
    return {
        customerNumber,
        menuId,
        status: 'menunggu',
        timeLeftSeconds: ORDER_TIME_LIMIT_SECONDS,
        activeProcess: null,
        completedProcesses: [],
    };
}

/**
 * Memulai satu proses (goreng, seduh, dst.). Diabaikan bila pesanan
 * sudah tidak menunggu atau masih ada proses yang berjalan.
 * @param {ReturnType<typeof createOrder>} order
 * @param {{ action: string, tool: string }} process
 */
export function startProcess(order, { action, tool }) {
    if (order.status !== 'menunggu' || order.activeProcess !== null) {
        return order;
    }
    return { ...order, activeProcess: { action, tool, elapsedSeconds: 0 } };
}

/**
 * Progres proses yang berjalan, dari 0 sampai 1.
 * @param {ReturnType<typeof createOrder>} order
 */
export function getProcessProgress(order) {
    if (order.activeProcess === null) return 0;
    return Math.min(1, order.activeProcess.elapsedSeconds / PROCESS_DURATION_SECONDS);
}

/**
 * Memajukan waktu. Saat paused, timer dan proses sama-sama berhenti.
 * Jika timer habis, proses yang berjalan dibatalkan dan pelanggan pergi.
 * @param {ReturnType<typeof createOrder>} order
 * @param {number} deltaSeconds selisih waktu sejak tick terakhir
 * @param {boolean} paused
 */
export function tick(order, deltaSeconds, paused) {
    if (paused || order.status !== 'menunggu' || !(deltaSeconds > 0)) {
        return order;
    }

    const appliedDelta = Math.min(deltaSeconds, order.timeLeftSeconds);
    let timeLeftSeconds = order.timeLeftSeconds - appliedDelta;
    if (timeLeftSeconds <= EPSILON) timeLeftSeconds = 0;

    let activeProcess = order.activeProcess;
    let completedProcesses = order.completedProcesses;

    if (activeProcess !== null) {
        const elapsedSeconds = activeProcess.elapsedSeconds + appliedDelta;
        if (elapsedSeconds >= PROCESS_DURATION_SECONDS - EPSILON) {
            completedProcesses = [
                ...completedProcesses,
                { action: activeProcess.action, tool: activeProcess.tool },
            ];
            activeProcess = null;
        } else {
            activeProcess = { ...activeProcess, elapsedSeconds };
        }
    }

    if (timeLeftSeconds === 0) {
        // Timer habis: proses yang belum selesai dibatalkan.
        return { ...order, timeLeftSeconds, status: 'pergi', activeProcess: null, completedProcesses };
    }
    return { ...order, timeLeftSeconds, activeProcess, completedProcesses };
}