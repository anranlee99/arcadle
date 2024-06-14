export default function Header({title}){
    return (
        <header className="page-header" style={{gridArea:'header'}}>
                <h1 className="page-title">{title} </h1>
            </header>
    )
}