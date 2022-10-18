
const Search = () => {
    return (
    <div className='flex justfy-center place-content-center flex-col items-center mt-16  w-10/12 md:w-7/12 lg:w-6/12 xl:w-4/12'>
        <div className="bg-white rounded-lg px-4 py-5 shadow-md flex flex-row w-full">
            <div className="flex flex-1 min-w pr-2">
                <input type="search" id="search" className="block px-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar por coleções e marcas" required />
            </div>
            <div className="flex border-l-2 pl-2">
                <select id="countries" className="bg-white border border-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-8">
                    <option selected>Todas Categorias</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                </select>
            </div>
            <div className="flex pl-2 content-center items-center">
                <button type="button" className="text-blue-700 flex border border-white hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-7 h-7 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800">
                    <svg aria-hidden="true" className="w-full h-full" fill="currentColor" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z"></path></svg>
                    <span className="sr-only">P</span>
                </button>

            </div>

               
        </div>
    </div>
    )
}

export default Search