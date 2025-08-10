// Utilidades de armazenamento local de tecnologias (pendentes/aprovadas)
// Segurança SSR: todas as leituras/escritas checam window/localStorage

import { Technology, TechStatus } from '@/types';

const PENDING_KEY = 'transfertec_pending_technologies';
const APPROVED_KEY = 'transfertec_approved_technologies';

export const STORAGE_EVENTS = {
  pendingUpdated: 'transfertec:pending-updated',
  approvedUpdated: 'transfertec:approved-updated',
} as const;

function safeParse<T>(text: string | null, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emit(name: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(name));
  }
}

export function getPendingTechnologies(): Technology[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(PENDING_KEY);
  return safeParse<Technology[]>(raw, []);
}

export function savePendingTechnologies(list: Technology[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(list));
  emit(STORAGE_EVENTS.pendingUpdated);
}

export function addPendingTechnology(tech: Technology): void {
  const list = getPendingTechnologies();
  const exists = list.some((t) => t.tokenId === tech.tokenId);
  const updated = exists ? list.map((t) => (t.tokenId === tech.tokenId ? tech : t)) : [tech, ...list];
  savePendingTechnologies(updated);
}

export function removePendingTechnology(tokenId: string): void {
  const list = getPendingTechnologies();
  savePendingTechnologies(list.filter((t) => t.tokenId !== tokenId));
}

export function getApprovedTechnologies(): Technology[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(APPROVED_KEY);
  return safeParse<Technology[]>(raw, []);
}

export function saveApprovedTechnologies(list: Technology[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(APPROVED_KEY, JSON.stringify(list));
  emit(STORAGE_EVENTS.approvedUpdated);
}

export function addApprovedTechnology(tech: Technology): void {
  const list = getApprovedTechnologies();
  const exists = list.some((t) => t.tokenId === tech.tokenId);
  const updated = exists ? list.map((t) => (t.tokenId === tech.tokenId ? tech : t)) : [tech, ...list];
  saveApprovedTechnologies(updated);
}

export function removeApprovedTechnology(tokenId: string): void {
  const list = getApprovedTechnologies();
  saveApprovedTechnologies(list.filter((t) => t.tokenId !== tokenId));
}

export function approveTechnology(tokenId: string): Technology | null {
  const pending = getPendingTechnologies();
  const tech = pending.find((t) => t.tokenId === tokenId) || null;
  if (!tech) return null;
  const approvedTech: Technology = { ...tech, status: TechStatus.APPROVED };
  removePendingTechnology(tokenId);
  addApprovedTechnology(approvedTech);
  return approvedTech;
}

export function rejectTechnology(tokenId: string): void {
  removePendingTechnology(tokenId);
}


