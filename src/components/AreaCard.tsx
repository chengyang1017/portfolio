interface Props { number: string; title: string; description: string; icon: string; }
export function AreaCard({ number, title, description, icon }: Props) { return <article className="area-card"><div><span>{number}</span><i>{icon}</i></div><h3>{title}</h3><p>{description}</p></article>; }
