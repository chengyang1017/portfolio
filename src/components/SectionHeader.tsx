interface Props { index?: string; eyebrow: string; title?: string; action?: React.ReactNode; }
export function SectionHeader({ index, eyebrow, title, action }: Props) { return <header className="section-header"><div><p className="eyebrow">{index && `${index} / `}{eyebrow}</p>{title && <h2>{title}</h2>}</div>{action}</header>; }
