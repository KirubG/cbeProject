import React from "react";
import FormError from "../components/FormError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axios.js";

const schema = yup.object().shape({
  customer_name: yup.string().required("Customer name required"),
  buissness_name: yup.string().required("Buissness name required"),
  email: yup.string().required("Email required").email("Invalid email"),
  phone: yup
    .string()
    .required("Phone required")
    .min(10, "Invalid phone number")
    .max(10),
  office_id: yup.string().required("Office id required"),
  start_time: yup.string().required("Start time required"),
  end_time: yup.string().required("End time required"),
  catagory: yup.string().required("Catagory required"),
});

function Appointment() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submit = async (data) => {
    const response = await api.post("/create-appointment", data);
    console.log(response);
    reset();
  };
  return (
    <form action="" className="Hform" onSubmit={handleSubmit(submit)}>
      <div className="forminput">
        {errors.customer_name && (
          <FormError error={errors.customer_name.message} />
        )}
        <label htmlFor="">Customer Name</label>
        <input {...register("customer_name")} type="text" />
      </div>

      <div className="forminput">
        {errors.buissness_name && (
          <FormError error={errors.buissness_name.message} />
        )}
        <label htmlFor="">Buissness Name</label>
        <input {...register("buissness_name")} type="text" />
      </div>

      <div className="forminput">
        {errors.email && <FormError error={errors.email.message} />}
        <label htmlFor="">Email</label>
        <input {...register("email")} type="text" />
      </div>

      <div className="forminput">
        {errors.phone && <FormError error={errors.phone.message} />}

        <label htmlFor="">Phone Number</label>
        <input
          {...register("phone")}
          type="tel"
          pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}"
        />
      </div>

      <div className="forminput">
        {errors.office_id && <FormError error={errors.office_id.message} />}

        <label htmlFor="">Office Id</label>
        <input {...register("office_id")} type="text" />
      </div>

      <div className="forminput">
        {errors.start_time && <FormError error={errors.start_time.message} />}

        <label htmlFor="">Start Time</label>
        <input {...register("start_time")} type="datetime-local" />
      </div>

      <div className="forminput">
        {errors.end_time && <FormError error={errors.end_time.message} />}
        <label htmlFor="">End Time</label>
        <input {...register("end_time")} type="datetime-local" />
      </div>

      <div className="forminput">
        {errors.catagory && <FormError error={errors.catagory.message} />}
        <label htmlFor="">Cataory</label>
        <input {...register("catagory")} type="text" />
      </div>
      <button type="submit" className="btn btn-submit">
        Submit
      </button>
    </form>
  );
}

export default Appointment;
