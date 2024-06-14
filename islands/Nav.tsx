export default function Nav() {
  return (
    <>
      <aside class="w-64 h-screen bg-gray-800 text-white flex flex-col">
        <div class="text-3xl text-center py-4 border-b border-gray-700">
          <a href="/" class="py-2 hover:bg-gray-700 rounded">
            LOGO
          </a>
        </div>
        <nav class="flex flex-col flex-1 px-4 py-8">
          <a href="/" class="py-2 hover:bg-gray-700 rounded">
            HOME
          </a>
          <a href="/wordle" class="py-2 hover:bg-gray-700 rounded">
            WORDLE
          </a>
        </nav>
      </aside>
    </>
  );
}
