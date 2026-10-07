const menuItems = [
  { label: 'Dashboard', active: true },
  { label: 'Projetos' },
  { label: 'Relatórios' },
  { label: 'Configurações' },
];

export default function MenuLateral() {
  return (
    <aside style={{ width: '220px', background: '#111827', color: '#fff', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>CodeTrack</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.label} style={{ marginBottom: '0.75rem' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  background: item.active ? '#2563eb' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
