'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Building2,
  Bell,
  ShieldAlert,
  TriangleAlert,
  Info,
  Save,
  CheckCircle2,
} from 'lucide-react';

/* ─────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────── */
function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--background)', border: '0.5px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '0.5px solid var(--border)' }}
      >
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#EAF3DE', color: 'var(--ag-primary)' }}
        >
          <Icon size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {description}
          </div>
        </div>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FORM FIELD
───────────────────────────────────────── */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      <div className="pt-1">
        <div className="text-xs font-medium">{label}</div>
        {hint && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {hint}
          </div>
        )}
      </div>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   INPUT STYLE
───────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: '13px',
  padding: '7px 12px',
  borderRadius: '8px',
  border: '0.5px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
  outline: 'none',
};

/* ─────────────────────────────────────────
   TOGGLE SWITCH
───────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? 'var(--ag-primary)' : '#D1D5DB' }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

/* ─────────────────────────────────────────
   ALERT ROW
───────────────────────────────────────── */
function AlertRow({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg"
      style={{ background: 'var(--muted)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={14} strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-xs font-medium">{label}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {description}
          </div>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function SettingsPage() {
  /* --- Profil state --- */
  const [name, setName] = useState('Analyst');
  const [role, setRole] = useState('Analis Pangan');
  const [org, setOrg] = useState('Kementerian Pertanian RI');
  const [email] = useState('analyst@agriflow.ai');

  /* --- Alert preferences state --- */
  const [thresholdCritical, setThresholdCritical] = useState('20');
  const [thresholdWarning, setThresholdWarning] = useState('10');
  const [alertEmail, setAlertEmail] = useState(true);
  const [alertInApp, setAlertInApp] = useState(true);
  const [alertWhatsapp, setAlertWhatsapp] = useState(false);
  const [alertCritical, setAlertCritical] = useState(true);
  const [alertHigh, setAlertHigh] = useState(true);
  const [alertMedium, setAlertMedium] = useState(false);

  /* --- Save feedback --- */
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // In production: call API to persist settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Pengaturan</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Kelola profil dan preferensi sistem Anda
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          style={{
            background: saved ? '#EAF3DE' : 'var(--ag-primary)',
            color: saved ? '#27500A' : 'white',
          }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={14} />
              Tersimpan
            </>
          ) : (
            <>
              <Save size={14} />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════
          SECTION 1 — Profil Pengguna
      ══════════════════════════════════ */}
      <Section
        title="Profil Pengguna"
        description="Informasi identitas akun Anda di sistem Agriflow"
        icon={User}
      >
        {/* Avatar */}
        <Field label="Foto Profil">
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
              style={{ background: 'var(--ag-primary)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ border: '0.5px solid var(--border)', background: 'var(--background)' }}
              >
                Ganti Foto
              </button>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                PNG atau JPG, maks 1 MB
              </p>
            </div>
          </div>
        </Field>

        <div style={{ borderTop: '0.5px solid var(--border)' }} />

        {/* Name */}
        <Field label="Nama Lengkap" hint="Nama yang ditampilkan di dasbor">
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
          />
        </Field>

        {/* Role */}
        <Field label="Jabatan / Peran" hint="Posisi Anda dalam organisasi">
          <input
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Contoh: Analis Pangan"
          />
        </Field>

        {/* Organization */}
        <Field label="Instansi / Organisasi">
          <input
            style={inputStyle}
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Nama instansi Anda"
          />
        </Field>

        {/* Email (read-only) */}
        <Field label="Email Akun" hint="Email tidak dapat diubah">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-1"
              style={{
                border: '0.5px solid var(--border)',
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
              }}
            >
              <Mail size={13} />
              {email}
            </div>
          </div>
        </Field>
      </Section>

      {/* ══════════════════════════════════
          SECTION 2 — Alert & Notifikasi
      ══════════════════════════════════ */}
      <Section
        title="Preferensi Alert & Notifikasi"
        description="Atur kapan dan bagaimana Anda menerima peringatan harga"
        icon={Bell}
      >
        {/* Thresholds */}
        <div>
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            AMBANG BATAS PERINGATAN
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ background: '#FFF5F5', border: '0.5px solid #F5C2C2' }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldAlert size={13} color="#A32D2D" />
                <span className="text-xs font-semibold" style={{ color: '#A32D2D' }}>
                  Status Kritis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Kenaikan harga ≥
                </span>
                <input
                  type="number"
                  value={thresholdCritical}
                  onChange={(e) => setThresholdCritical(e.target.value)}
                  className="w-14 text-center text-xs font-semibold rounded-md px-2 py-1 outline-none"
                  style={{ border: '0.5px solid #F5C2C2', background: 'white', color: '#A32D2D' }}
                  min={1}
                  max={100}
                />
                <span className="text-xs font-semibold" style={{ color: '#A32D2D' }}>%</span>
              </div>
            </div>

            <div
              className="p-3 rounded-lg"
              style={{ background: '#FFFBF0', border: '0.5px solid #F5D68A' }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <TriangleAlert size={13} color="#633806" />
                <span className="text-xs font-semibold" style={{ color: '#633806' }}>
                  Status Waspada
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Kenaikan harga ≥
                </span>
                <input
                  type="number"
                  value={thresholdWarning}
                  onChange={(e) => setThresholdWarning(e.target.value)}
                  className="w-14 text-center text-xs font-semibold rounded-md px-2 py-1 outline-none"
                  style={{ border: '0.5px solid #F5D68A', background: 'white', color: '#633806' }}
                  min={1}
                  max={100}
                />
                <span className="text-xs font-semibold" style={{ color: '#633806' }}>%</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '0.5px solid var(--border)' }} />

        {/* Notification channels */}
        <div>
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            SALURAN NOTIFIKASI
          </div>
          <div className="space-y-2">
            <AlertRow
              icon={Mail}
              iconBg="#E6F1FB"
              iconColor="#0C447C"
              label="Notifikasi Email"
              description="Kirim ringkasan alert ke email terdaftar"
              checked={alertEmail}
              onChange={setAlertEmail}
            />
            <AlertRow
              icon={Bell}
              iconBg="#EAF3DE"
              iconColor="#27500A"
              label="Notifikasi Dalam Aplikasi"
              description="Tampilkan badge dan popup di dasbor"
              checked={alertInApp}
              onChange={setAlertInApp}
            />
            <AlertRow
              icon={Info}
              iconBg="#FAEEDA"
              iconColor="#633806"
              label="Notifikasi WhatsApp"
              description="Peringatan dikirim via pesan WhatsApp"
              checked={alertWhatsapp}
              onChange={setAlertWhatsapp}
            />
          </div>
        </div>

        <div style={{ borderTop: '0.5px solid var(--border)' }} />

        {/* Alert level filter */}
        <div>
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            JENIS ALERT YANG DITERIMA
          </div>
          <div className="space-y-2">
            <AlertRow
              icon={ShieldAlert}
              iconBg="#FCEBEB"
              iconColor="#A32D2D"
              label="Kritis"
              description="Kenaikan ekstrem yang perlu tindakan segera"
              checked={alertCritical}
              onChange={setAlertCritical}
            />
            <AlertRow
              icon={TriangleAlert}
              iconBg="#FAEEDA"
              iconColor="#633806"
              label="Tinggi"
              description="Kenaikan signifikan yang perlu dipantau"
              checked={alertHigh}
              onChange={setAlertHigh}
            />
            <AlertRow
              icon={Info}
              iconBg="#E6F1FB"
              iconColor="#0C447C"
              label="Sedang & Rendah"
              description="Pergerakan harga di bawah ambang batas kritis"
              checked={alertMedium}
              onChange={setAlertMedium}
            />
          </div>
        </div>

        {/* Info note */}
        <div
          className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs"
          style={{ background: '#EAF3DE', color: '#27500A' }}
        >
          <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" />
          <span>
            Pengaturan notifikasi berlaku untuk akun ini saja dan tidak mempengaruhi pengguna lain.
          </span>
        </div>
      </Section>
    </div>
  );
}
