import { useVehicle } from "@/_libs/services/queries/vehicles.queries";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import CreateOrEditVehicleSection from "../CreateOrEditVehicleSection";



export default function EditVehicle() {
  const { id } = useParams();
  const { data, isLoading } = useVehicle(Number(id));

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <CreateOrEditVehicleSection mode="edit" vehicle={data} />
      )}
    </>
  );
}
