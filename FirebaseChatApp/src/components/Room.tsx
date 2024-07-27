import { useLoaderData } from "react-router-dom"

export async function loader({ params } : {params: any}) {
console.log(params)
  return params.id
}

export default function Room() {

  const id = useLoaderData() as string
  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div>

      </div>
      <div className="h-[80px]">
        <form action="">
          <input type="text" />
        </form>
      </div>
    </div>
    // <div>{id}</div>
  )
}
