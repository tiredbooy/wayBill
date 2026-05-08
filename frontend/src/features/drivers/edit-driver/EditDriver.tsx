import { useDriver } from "@/_libs/services/queries/drivers.queries";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import CreateOrEditDriverSection from "../create-driver/CreateOrEditDriverSection";

export default function EditDriver() {
  const { id } = useParams();
  const { data, isLoading } = useDriver(Number(id));

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <CreateOrEditDriverSection
          mode="edit"
          driver={data}
        />
      )}
    </>
  );
}
