import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
export { LayoutDashboard, SlidersHorizontal, Users, ClipboardList, Trophy, ChartNoAxesCombined, Globe, ChevronDown, ChevronRight, ArrowRight, ArrowUpRight, ArrowLeft, Plus, Search, CalendarDays, Clock3, Check, CheckCheck, CircleHelp, LogOut, Ellipsis, ExternalLink, Download, Copy, X, Pencil, Trash2, Save, CircleDot, Menu, TrendingUp, Info, ArrowUpDown, CheckCircle2, Settings2 } from 'lucide-react'

export function Button({ variant = 'secondary', className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; children: ReactNode }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className = '', ...props }, ref) { return <input ref={ref} className={`input ${className}`} {...props} /> })
export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`input select ${className}`} {...props}>{children}</select> }
export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`input textarea ${className}`} {...props} /> }
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) { return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label> }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'blue' | 'green' | 'amber' }) { return <span className={`badge badge-${tone}`}>{children}</span> }
export function Panel({ title, subtitle, action, children, className = '' }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) { return <section className={`panel ${className}`}>{title && <div className="panel-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>}{children}</section> }
export function TeamMark({ index, small = false }: { index: number; small?: boolean }) { return <span className={`team-mark team-color-${index % 8} ${small ? 'small' : ''}`}>{['PL', 'RR', 'SS', 'KP', 'AM', 'GF', 'LS', 'TP'][index % 8]}</span> }
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => { dialog?.close() } }, [])
  return <dialog ref={ref} className="modal" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose() }}><div className="modal-heading"><h2>{title}</h2><Button variant="ghost" aria-label="Close dialog" onClick={onClose}>×</Button></div>{children}</dialog>
}
