type userData = {
    displayName: string
    uid: string
    joinDate: Date
    role: string
    photoURL: string
}
  
type Props = {
    users: userData[],
}

const RoomSidebar = (props: Props) => {
  return (
    <div className="w-[30%] max-w-[320px] min-w-[240px]  bg-black flex flex-col items-start px-2">
    <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown hover <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
    </button>
    <div id="dropdownHover" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
    </div>
    <p>
      Room owner
    </p>
    {
      props.users.filter(x => x.role === "owner").map(user =>
        <div className="flex gap-2 hover:bg-[#35373c] transition-all w-full px-2 py-1 rounded-lg items-center">
          <img src={user.photoURL} alt="profile" className=" w-[32px] aspect-square rounded-full"/>
          <p>{user.displayName}</p>
        </div>
      )
    }
    <p>
      Member/s - {props.users.filter(x => x.role === "member").length}
    </p>
    {
      props.users.filter(x => x.role === "member").map(user =>
        <div className="flex gap-2 hover:bg-[#35373c] transition-all w-full px-2 py-1 rounded-lg items-center">
          <img src={user.photoURL} alt="profile" className=" w-[32px] aspect-square rounded-full"/>
          <p>{user.displayName}</p>
        </div>
      )
    }
  </div>
)
}

export default RoomSidebar