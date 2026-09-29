import React, {useEffect, useMemo, useState} from 'react';
import {
  LayoutDashboard, LibraryBig, Users, BarChart3, Bell, Settings, Menu,
  X, Search, BookOpen, UserPlus, ArrowDownToLine, ArrowUpFromLine,
  Sparkles, Clock3, ChevronRight, Moon, Sun, CheckCircle2, AlertTriangle,
  TrendingUp, BookMarked, CircleUserRound, LogOut, Filter, RefreshCcw
} from 'lucide-react';
import {getBooks, issueBook, returnBook, getMembers, createMember, getActivity, getStats, getNotifications} from './api';

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Books', LibraryBig],
  ['Members', Users],
  ['Analytics', BarChart3],
];

function App(){
  const [page,setPage]=useState('Dashboard');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [dark,setDark]=useState(false);
  const [toast,setToast]=useState(null);
  const [stats,setStats]=useState(null);
  const [books,setBooks]=useState([]);
  const [members,setMembers]=useState([]);
  const [activity,setActivity]=useState([]);
  const [notifications,setNotifications]=useState([]);

  const refresh = async ()=>{
    try{
      const [s,b,m,a,n] = await Promise.all([getStats(),getBooks(),getMembers(),getActivity(),getNotifications()]);
      setStats(s.data); setBooks(b.data); setMembers(m.data); setActivity(a.data); setNotifications(n.data);
    }catch(e){ showToast('Start the Django server first.', 'error'); }
  };
  useEffect(()=>{refresh()},[]);
  useEffect(()=>{document.body.className=dark?'dark':''},[dark]);

  const showToast=(message,type='success')=>{
    setToast({message,type}); setTimeout(()=>setToast(null),2800);
  };

  const issue=async id=>{
    try{await issueBook(id); await refresh(); showToast('Book issued successfully.');}
    catch(e){showToast(e.response?.data?.error || 'Unable to issue book.','error')}
  };
  const ret=async id=>{
    try{await returnBook(id); await refresh(); showToast('Book returned successfully.');}
    catch(e){showToast('Unable to return book.','error')}
  };
  const addMember=async data=>{
    try{await createMember(data); await refresh(); showToast('New member added.');}
    catch(e){showToast(e.response?.data?.error || 'Unable to add member.','error')}
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?'open':''}`}>
      <div className="brand"><div className="brand-icon"><BookOpen size={22}/></div><div><b>Libra</b><span>Library OS</span></div><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="workspace"><span>WORKSPACE</span><div className="workspace-row"><div className="avatar">AC</div><div><b>Academic Library</b><small>Administrator</small></div><ChevronRight size={15}/></div></div>
      <nav>{nav.map(([name,Icon])=><button key={name} className={page===name?'active':''} onClick={()=>{setPage(name);setMobileOpen(false)}}><Icon size={19}/><span>{name}</span>{name==='Dashboard'&&<i/>}</button>)}</nav>
      <div className="side-bottom">
        <button onClick={()=>showToast('All systems operational.')}><Settings size={18}/> Settings</button>
        <div className="mini-card"><Sparkles size={18}/><div><b>Smart Library</b><span>Manage knowledge better.</span></div></div>
        <button className="profile"><CircleUserRound size={19}/><div><b>Admin User</b><span>admin@library.edu</span></div><LogOut size={16}/></button>
      </div>
    </aside>
    <main className="main">
      <header>
        <button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu/></button>
        <div className="crumb"><span>Library</span><ChevronRight size={14}/><b>{page}</b></div>
        <div className="header-actions">
          <button className="icon-btn" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
          <button className="icon-btn notification" onClick={()=>showToast(`${notifications.length} notifications`)}><Bell size={18}/><i/></button>
          <div className="top-avatar">AU</div>
        </div>
      </header>

      {page==='Dashboard' && <Dashboard stats={stats} books={books} activity={activity} onIssue={issue} onReturn={ret} go={setPage}/>}
      {page==='Books' && <Books books={books} onIssue={issue} onReturn={ret} refresh={refresh}/>}
      {page==='Members' && <Members members={members} onAdd={addMember}/>}
      {page==='Analytics' && <Analytics stats={stats}/>}
    </main>
    {toast && <div className={`toast ${toast.type}`}><CheckCircle2 size={18}/><span>{toast.message}</span></div>}
  </div>
}

function PageTitle({eyebrow,title,desc,action}){return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>}

function Dashboard({stats,books,activity,onIssue,onReturn,go}){
  if(!stats) return <Loading/>;
  const popular=books.slice(0,5);
  return <div className="content">
    <PageTitle eyebrow="TUESDAY · SEPTEMBER 29, 2026" title="Good afternoon, Admin 👋" desc="Here's what's happening across your library today." action={<button className="primary" onClick={()=>go('Books')}><BookMarked size={17}/> Manage library</button>}/>
    <section className="hero-banner">
      <div><div className="hero-glow"/><span className="hero-tag"><Sparkles size={14}/> LIBRARY INSIGHT</span><h2>Your knowledge hub is<br/><em>alive & growing.</em></h2><p>Track books, members and circulation from one calm workspace.</p><button onClick={()=>go('Analytics')}>View insights <ChevronRight size={16}/></button></div>
      <div className="hero-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="hero-book"><BookOpen size={38}/></div><span>+{stats.issued_books} issued</span></div>
    </section>
    <div className="stat-grid">
      <Stat icon={LibraryBig} label="Total copies" value={stats.total_books} sub={`${stats.unique_titles} unique titles`} />
      <Stat icon={BookMarked} label="Available now" value={stats.available_books} sub="Ready to borrow" />
      <Stat icon={ArrowUpFromLine} label="Currently issued" value={stats.issued_books} sub="Active circulation" />
      <Stat icon={Users} label="Members" value={stats.members} sub="+12% this month" trend />
    </div>
    <div className="dashboard-grid">
      <section className="panel wide"><div className="panel-head"><div><h3>Popular in the library</h3><p>Curated selection from your catalog</p></div><button className="link-btn" onClick={()=>go('Books')}>View all <ChevronRight size={15}/></button></div><div className="book-row">{popular.map(b=><BookMini key={b.id} book={b} onIssue={onIssue}/>)}</div></section>
      <section className="panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Latest library events</p></div><Clock3 size={18}/></div><div className="activity-list">{activity.slice(0,5).map(a=><Activity key={a.id} item={a}/>)}</div></section>
    </div>
    <div className="dashboard-grid lower">
      <section className="panel"><div className="panel-head"><div><h3>Circulation health</h3><p>Current availability snapshot</p></div><span className="health"><span/> Healthy</span></div><div className="health-bar"><span style={{width:`${(stats.available_books/stats.total_books)*100}%`}}/></div><div className="health-meta"><span><b>{stats.available_books}</b> available</span><span><b>{stats.issued_books}</b> issued</span><span><b>{stats.overdue}</b> overdue</span></div></section>
      <section className="panel quick"><div className="panel-head"><div><h3>Quick actions</h3><p>Common tasks at a glance</p></div></div><div className="quick-grid"><button onClick={()=>go('Books')}><ArrowDownToLine/><span>Issue book</span></button><button onClick={()=>go('Books')}><ArrowUpFromLine/><span>Return book</span></button><button onClick={()=>go('Members')}><UserPlus/><span>Add member</span></button><button onClick={()=>go('Analytics')}><BarChart3/><span>View reports</span></button></div></section>
    </div>
  </div>
}

function Stat({icon:Icon,label,value,sub,trend}){return <div className="stat-card"><div className="stat-icon"><Icon size={20}/></div><div className="stat-label">{label}</div><strong>{value}</strong><small>{trend&&<TrendingUp size={13}/>} {sub}</small></div>}
function BookMini({book,onIssue}){return <div className="book-mini"><div className={`book-cover ${book.color}`}><BookOpen size={26}/><span>{book.category}</span></div><div><b>{book.title}</b><small>{book.author}</small><div className="book-meta"><span>★ {book.rating}</span><button disabled={!book.available} onClick={()=>onIssue(book.id)}>{book.available?'Issue':'Unavailable'}</button></div></div></div>}
function Activity({item}){return <div className="activity"><div className={`activity-dot ${item.type}`}>{item.type==='issue'?<ArrowDownToLine size={13}/>:item.type==='return'?<ArrowUpFromLine size={13}/>:<UserPlus size={13}/>}</div><div><b>{item.title}</b><span>{item.detail}</span><small>{item.time}</small></div></div>}
function Loading(){return <div className="loading"><div className="spinner"/><b>Loading your library...</b></div>}

function Books({books,onIssue,onReturn,refresh}){
  const [search,setSearch]=useState('');
  const [cat,setCat]=useState('All');
  const [only,setOnly]=useState(false);
  const [selected,setSelected]=useState(null);
  const cats=['All',...new Set(books.map(b=>b.category))];
  const filtered=books.filter(b=>(cat==='All'||b.category===cat)&&(!only||b.available>0)&&(b.title+b.author+b.isbn).toLowerCase().includes(search.toLowerCase()));
  return <div className="content"><PageTitle eyebrow="CATALOG MANAGEMENT" title="Books & Catalog" desc="Search, explore and manage every title in your collection." action={<button className="secondary" onClick={refresh}><RefreshCcw size={16}/> Refresh</button>}/>
    <div className="toolbar"><div className="searchbox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title, author or ISBN..." /></div><select value={cat} onChange={e=>setCat(e.target.value)}><option>All</option>{cats.slice(1).map(c=><option key={c}>{c}</option>)}</select><button className={only?'filter active':'filter'} onClick={()=>setOnly(!only)}><Filter size={16}/> Available only</button></div>
    <div className="catalog-grid">{filtered.map(b=><BookCard key={b.id} book={b} onIssue={onIssue} onReturn={onReturn} onOpen={setSelected}/>)}</div>
    {selected&&<BookModal book={selected} close={()=>setSelected(null)} onIssue={onIssue} onReturn={onReturn}/>}
  </div>
}
function BookCard({book,onIssue,onReturn,onOpen}){return <article className="book-card"><div className={`large-cover ${book.color}`}><BookOpen size={42}/><span>{book.category}</span><div className="cover-id">#{String(book.id).padStart(3,'0')}</div></div><div className="book-info"><div className="book-status">{book.available>0?<span className="available"><i/> Available</span>:<span className="unavailable"><i/> Checked out</span>}<span>★ {book.rating}</span></div><h3>{book.title}</h3><p>{book.author}</p><div className="isbn">ISBN {book.isbn} · {book.year}</div><div className="card-actions"><button className="details" onClick={()=>onOpen(book)}>Details</button>{book.available>0?<button className="issue-btn" onClick={()=>onIssue(book.id)}><ArrowDownToLine size={15}/> Issue</button>:<button className="return-btn" onClick={()=>onReturn(book.id)}><ArrowUpFromLine size={15}/> Return</button>}</div></div></article>}

function BookModal({book,close,onIssue,onReturn}){return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}><X/></button><div className={`modal-cover ${book.color}`}><BookOpen size={58}/></div><div className="modal-body"><span className="pill">{book.category}</span><h2>{book.title}</h2><p className="author">by {book.author}</p><p>{book.description}</p><div className="detail-grid"><div><small>ISBN</small><b>{book.isbn}</b></div><div><small>Published</small><b>{book.year}</b></div><div><small>Shelf</small><b>{book.shelf}</b></div><div><small>Availability</small><b>{book.available} / {book.copies}</b></div></div><div className="modal-actions">{book.available>0?<button className="primary" onClick={()=>{onIssue(book.id);close()}}><ArrowDownToLine/> Issue this book</button>:<button className="secondary" onClick={()=>{onReturn(book.id);close()}}><ArrowUpFromLine/> Return a copy</button>}</div></div></div></div>}

function Members({members,onAdd}){const [open,setOpen]=useState(false); const [form,setForm]=useState({name:'',email:'',course:'CSE',year:'3rd Year'}); const submit=e=>{e.preventDefault();onAdd(form);setForm({name:'',email:'',course:'CSE',year:'3rd Year'});setOpen(false)};return <div className="content"><PageTitle eyebrow="PEOPLE & ACCESS" title="Library Members" desc="Manage student members and their current borrowing activity." action={<button className="primary" onClick={()=>setOpen(true)}><UserPlus size={17}/> Add member</button>}/><div className="member-summary"><Stat icon={Users} label="Active members" value={members.length} sub="Registered students"/><Stat icon={BookMarked} label="Books on loan" value={members.reduce((a,m)=>a+m.borrowed,0)} sub="Across all members"/><Stat icon={AlertTriangle} label="Attention needed" value="3" sub="Overdue loans"/></div><section className="panel member-panel"><div className="panel-head"><div><h3>Member directory</h3><p>Student records available in this demo</p></div><div className="search-small"><Search size={16}/><input placeholder="Find a member..."/></div></div><div className="table-wrap"><table><thead><tr><th>Member</th><th>Course</th><th>Year</th><th>Borrowed</th><th>Status</th><th>Action</th></tr></thead><tbody>{members.map(m=><tr key={m.id}><td><div className="member-cell"><div className="member-avatar">{m.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><b>{m.name}</b><span>{m.email}</span></div></div></td><td>{m.course}</td><td>{m.year}</td><td><b>{m.borrowed}</b> books</td><td><span className="status-active"><i/> {m.status}</span></td><td><button className="dots" onClick={()=>{}}>•••</button></td></tr>)}</tbody></table></div></section>{open&&<div className="modal-backdrop"><form className="form-modal" onSubmit={submit}><button type="button" className="modal-close" onClick={()=>setOpen(false)}><X/></button><span className="eyebrow">NEW MEMBER</span><h2>Add library member</h2><p>Create a new student membership record.</p><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sandhya R"/></label><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="student@college.edu"/></label><div className="form-row"><label>Course<select value={form.course} onChange={e=>setForm({...form,course:e.target.value})}><option>CSE</option><option>AIML</option><option>ECE</option><option>IT</option><option>EEE</option></select></label><label>Year<select value={form.year} onChange={e=>setForm({...form,year:e.target.value})}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label></div><button className="primary submit">Create member</button></form></div>}</div>}

function Analytics({stats}){if(!stats)return <Loading/>; const max=Math.max(...stats.monthly_issues); return <div className="content"><PageTitle eyebrow="REPORTS & INSIGHTS" title="Library Analytics" desc="A visual snapshot of circulation and collection health."/><div className="analytics-grid"><section className="panel chart-panel"><div className="panel-head"><div><h3>Monthly circulation</h3><p>Books issued over the last 12 months</p></div><span className="chart-badge"><TrendingUp size={14}/> +18.4%</span></div><div className="bar-chart">{stats.monthly_issues.map((v,i)=><div className="bar-col" key={i}><div className="bar-value">{v}</div><div className="bar" style={{height:`${(v/max)*150}px`}}/><small>{['O','N','D','J','F','M','A','M','J','J','A','S'][i]}</small></div>)}</div></section><section className="panel"><div className="panel-head"><div><h3>Collection mix</h3><p>Titles by category</p></div></div><div className="mix-list">{stats.category_breakdown.map((x,i)=><div className="mix" key={x.name}><div><span className={`mix-dot d${i}`}/><b>{x.name}</b></div><strong>{x.value}</strong></div>)}</div></section></div><div className="analytics-cards"><Stat icon={LibraryBig} label="Collection size" value={stats.total_books} sub="Physical copies"/><Stat icon={BookMarked} label="Utilization" value={`${Math.round(stats.issued_books/stats.total_books*100)}%`} sub="Currently borrowed"/><Stat icon={AlertTriangle} label="Overdue" value={stats.overdue} sub="Needs attention"/><Stat icon={TrendingUp} label="Categories" value={stats.categories} sub="Across catalog"/></div></div>}

export default App;
