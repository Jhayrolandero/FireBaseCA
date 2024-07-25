import React from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography
} from "@material-tailwind/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";


interface RoomInput {
    roomName: string
    topics: string[]
    capacity: number
    public: boolean
}

export function RoomForm() {
  const [open, setOpen] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RoomInput>({
    defaultValues: {
      roomName: "",
      public: false,
      capacity: 0,
      topics: [],
    },
  })

  const onSubmit: SubmitHandler<RoomInput> = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "rooms"), data);
        console.log("Document written with ID: ", docRef.id);
        console.log(data)
    } catch(err) {
        console.error(err)
    }
  }
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        + Room
      </Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Card className="mx-auto w-full max-w-[24rem]">
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="blue-gray">
                  Create Room
                </Typography>
                <Typography className="-mb-2" variant="h6">
                  Room Name
                </Typography>
                <Controller
                    rules={{required: true}}
                    name="roomName"
                    control={control}
                    render={({ field }) => 
                        <Input label="Room Name" size="lg" crossOrigin={undefined} {...field}/>                    
                    }
                />
                <Typography className="-mb-2" variant="h6">
                    Topics
                </Typography>
                <div className="flex gap-2">
                <Controller
                    rules={{required: true}}
                    name="topics"
                    control={control}
                    render={({ field }) => 
                        // <Input label="Room Name" size="lg" crossOrigin={undefined} {...field}/>                    
                    <Input label="Topics" size="lg" crossOrigin={undefined} {...field}/>
                    }
                />
                <Button >
                    Add
                </Button>
                </div>
                <Typography className="-mb-2" variant="h6">
                    Capacity
                </Typography>
                <div className="flex gap-2">
                    <div className="flex items-center mb-4">
                        <input id="default-radio-1" type="radio" value="2"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('capacity', {required: true})}/>
                        <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">2</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-radio-1" type="radio" value="4"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('capacity', {required: true})}/>
                        <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">4</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-radio-1" type="radio" value="8"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('capacity', {required: true})}/>
                        <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">8</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-radio-1" type="radio" value="16"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('capacity', {required: true})}/>
                        <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">16</label>
                    </div>
                </div>
                <div className="-ml-2.5 -mt-3">
                <div className="flex ">
                    <input id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('public')}/>
                    <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
                </div>
                {/* <Controller
                    name="public"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => 
                        <Checkbox  label="make it private?" crossOrigin={undefined} {...field} />
                    }
                /> */}
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <Button variant="gradient"  fullWidth type="submit">
                    Create
                </Button>
              </CardFooter>
            </Card>
        </form>
      </Dialog>
    </>
  );
}