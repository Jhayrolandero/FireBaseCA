import { createContext } from "react"
import { UserProfile } from "../interface/UserProfile";
import RoomDisplay from "./RoomDisplay";
import { PlaceholdersAndVanishInput } from "../../@/components/ui/placeholders-and-vanish-input";

export const User = createContext<UserProfile | undefined>(undefined)
export default function Home() {  
  const placeholders = [
    "Tip: write t/ to search for topics",
    "PHP is cool...",
    "Where is Andrew Laeddis Hiding?",
    "Tip: write r/ to search for rooms",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
    "Tip: write i/ to search for room ID",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return(

    <div className="h-full flex flex-col gap-4 justify-center items-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <form className="min-w-[400px]">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
       
      </form>
      <RoomDisplay />
    </div>
  )

}


/*

<User.Provider value={userData}>
      <div className='min-h-[100dvh]  bg-[#030917] text-[#ff9100] grid grid-cols-[auto_1fr]'>
        <div className="border-r-[1px] border-[#ff9100] rounded-lg  min-w-[160px] flex flex-col p-4 items-center">
          <img src={userData.photoURL} alt="profile" className="rounded-full w-[80%] aspect-square"/>
          <hr className="text-[#ff9100]"/>
          <RoomForm />
          <button onClick={logOut}>Sign Out</button>
        </div>
        <div className="grid grid-rows-[auto_1fr_auto]">
          <Topnav />
          <main className="h-full flex flex-col gap-4 justify-center items-center">
            <form className="min-w-[400px]">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm border-b-2 border-[#ff9100] text-gray-900   bg-gray-50 focus:ring-blue-500 focus:border-blue-500 bg-transparent border-0 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            <RoomDisplay />
          </main>
        </div>
      </div>
      </User.Provider>


*/