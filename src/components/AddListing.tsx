import { useState } from "react"
import { useForm } from "@mantine/form"
import { Modal } from "@mantine/core"

function AddListing() {
    const [open, setOpen] = useState(false);

    const form = useForm({
        initialValues: {
            post_name: "",
            post_desc: ""
        }
    });

    return <>
        <Modal opened={open} onClose={() => setOpen(false)} title = "Create a listing">

        </Modal>

    </>

}

export default AddListing