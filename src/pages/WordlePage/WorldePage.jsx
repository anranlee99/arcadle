import WordRow from "../../components/GamesComponents/WordRow/WordRow"
export default function WordlePage() {
    return (
        <div className="mx-auto w-96">
            <header className="border-b border-gray-500 pb-2 my-2">
                <h1 className="text-4xl text-center">Wordle</h1>
            </header>
            <main>
                <WordRow letters={'hel'} letterLength={5} />
                <WordRow letters={'hell'} letterLength={5} />
                <WordRow letters={'hello'} letterLength={5} />
            </main>
        </div>
    )
}

