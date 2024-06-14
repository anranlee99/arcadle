interface HeaderProps {
    title: string;
}
export default function Header({title}:HeaderProps){
    return (
        <header className="page-header" style={{gridArea:'header'}}>
                <h1 className="page-title">{title} </h1>
            </header>
    )
}