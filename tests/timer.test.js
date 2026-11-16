import { describe, it, expect } from 'vitest';
import { MENU_CATALOG } from '../src/game/menu-catalog.js';
import {
    ORDER_TIME_LIMIT_SECONDS,
    PROCESS_DURATION_SECONDS,
    createOrder,
    startProcess,
    tick,
    getProcessProgress,
} from '../src/game/timer.js';

const newOrder = () => createOrder({ customerNumber: 1, menuId: 'M01' });
const fry = { action: 'goreng', tool: 'kompor + penggorengan' };

describe('timer pesanan (F4)', () => {
    it('memakai batas 30 detik dan proses 3 detik', () => {
        expect(ORDER_TIME_LIMIT_SECONDS).toBe(30);
        expect(PROCESS_DURATION_SECONDS).toBe(3);
    });

    it('pesanan baru menunggu dengan timer penuh', () => {
        const order = newOrder();
        expect(order.status).toBe('menunggu');
        expect(order.timeLeftSeconds).toBe(30);
        expect(order.activeProcess).toBeNull();
    });

    it('menghitung mundur dari 30 detik', () => {
        let order = newOrder();
        for (let i = 0; i < 10; i += 1) order = tick(order, 1, false);
        expect(order.timeLeftSeconds).toBe(20);
        expect(order.status).toBe('menunggu');
    });

    it('Pause tidak mengubah waktu', () => {
        const order = newOrder();
        expect(tick(order, 5, true).timeLeftSeconds).toBe(30);
    });

    it('Resume melanjutkan dari sisa waktu', () => {
        let order = tick(newOrder(), 10, false);
        order = tick(order, 5, true);
        expect(order.timeLeftSeconds).toBe(20);
        order = tick(order, 5, false);
        expect(order.timeLeftSeconds).toBe(15);
    });

    it('waktu tidak pernah negatif dan pelanggan pergi saat habis', () => {
        const order = tick(newOrder(), 100, false);
        expect(order.timeLeftSeconds).toBe(0);
        expect(order.status).toBe('pergi');
    });

    it('pesanan yang sudah pergi tidak berubah lagi', () => {
        const gone = tick(newOrder(), 100, false);
        expect(tick(gone, 5, false)).toBe(gone);
    });

    it('tidak mengubah objek pesanan asli (murni)', () => {
        const order = newOrder();
        tick(order, 5, false);
        expect(order.timeLeftSeconds).toBe(30);
    });
});

describe('proses 3 detik (F3, F4)', () => {
    it('proses selesai tepat setelah 3 detik', () => {
        let order = startProcess(newOrder(), fry);
        order = tick(order, 1, false);
        order = tick(order, 1, false);
        expect(order.activeProcess).not.toBeNull();
        expect(getProcessProgress(order)).toBeCloseTo(2 / 3);
        order = tick(order, 1, false);
        expect(order.activeProcess).toBeNull();
        expect(order.completedProcesses).toEqual([fry]);
    });

    it('proses tidak maju saat Pause lalu lanjut saat Resume', () => {
        let order = startProcess(newOrder(), fry);
        order = tick(order, 2, false);
        order = tick(order, 5, true);
        expect(getProcessProgress(order)).toBeCloseTo(2 / 3);
        order = tick(order, 1, false);
        expect(order.completedProcesses).toEqual([fry]);
    });

    it('timer habis di tengah proses membatalkan proses dan pelanggan pergi', () => {
        let order = tick(newOrder(), 28, false); // sisa 2 detik
        order = startProcess(order, fry);
        order = tick(order, 2, false);
        expect(order.status).toBe('pergi');
        expect(order.activeProcess).toBeNull();
        expect(order.completedProcesses).toEqual([]);
    });

    it('proses baru diabaikan saat masih ada proses berjalan atau sudah pergi', () => {
        const running = startProcess(newOrder(), fry);
        expect(startProcess(running, { action: 'aduk', tool: 'spatula' })).toBe(running);
        const gone = tick(newOrder(), 100, false);
        expect(startProcess(gone, fry)).toBe(gone);
    });
});

describe('konsistensi dengan katalog menu', () => {
    it('semua proses di katalog berdurasi sama dengan aturan 3 detik', () => {
        const durations = MENU_CATALOG.flatMap((menu) =>
            menu.steps.filter((s) => s.type === 'process').map((s) => s.duration_seconds),
        );
        expect(durations.every((d) => d === PROCESS_DURATION_SECONDS)).toBe(true);
    });

    it('total waktu proses tiap menu muat dalam batas 30 detik', () => {
        for (const menu of MENU_CATALOG) {
            const total = menu.steps
                .filter((s) => s.type === 'process')
                .reduce((sum, s) => sum + s.duration_seconds, 0);
            expect(total).toBeLessThanOrEqual(ORDER_TIME_LIMIT_SECONDS);
        }
    });
});