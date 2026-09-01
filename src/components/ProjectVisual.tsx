import type { Project } from '../data/projects';

const copy: Record<Project['mockup'], { kicker: string; title: string; items: string[] }> = {
  morphology:{kicker:'MORPHOLOGY MAP',title:'transformation',items:['trans','form','ation']}, commerce:{kicker:'NEW COLLECTION',title:'Objects for daily life',items:['Browse','Save','Checkout']}, language:{kicker:'TODAY · 18 MIN',title:'Build a real conversation',items:['Recall','Listen','Speak']}, keyboard:{kicker:'NÔM COMPOSER',title:'𡨸 Nôm',items:['nom','𡨸','喃']}, ide:{kicker:'LESSON 04',title:'Build a resilient parser',items:['main.ts','tests','Tutor']}, inflection:{kicker:'PARADIGM',title:'китеп · book',items:['китеп','китептин','китепке']},
};

export function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const item = copy[project.mockup];
  return <div className={`visual tone-${project.tone} ${compact ? 'compact' : ''}`}><div className="visual-window"><div className="visual-bar"><span>● ● ●</span><b>{project.shortTitle.toLowerCase()} / workspace</b></div><div className="visual-body"><aside><strong>{project.shortTitle}</strong>{item.items.map((value, i) => <small className={i === 1 ? 'selected' : ''} key={value}>{value}</small>)}</aside><div className="visual-canvas"><small>{item.kicker}</small><h3>{item.title}</h3><div className="visual-pills">{item.items.map((value, i) => <b className={i === 1 ? 'selected' : ''} key={value}>{value}</b>)}</div><div className="visual-lines"><i/><i/><i/></div></div></div></div></div>;
}
