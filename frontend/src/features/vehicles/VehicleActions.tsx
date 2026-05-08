import {
  useDeleteVehicle,
  useVehicle,
} from "@/_libs/services/queries/vehicles.queries";
import ActionDropdown from "../reusable/dialog/ActionsDropdown";
import DeleteAlert from "../reusable/dialog/DeleteAlert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  // props here
  vehicleID: number;
}

export default function VehicleActions({ vehicleID }: Props) {
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { data } = useVehicle(Number(vehicleID));
  const deleteVehicle = useDeleteVehicle();

  function editDriver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`edit/${vehicleID}`)
  }

  function deleteDriverBtn(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
  }

  function handleDeleteDriver() {
    deleteVehicle.mutateAsync(Number(vehicleID));
    setIsDeleting(false);
  }

  return (
    <>
      <ActionDropdown
        edit
        haveDelete
        onEdit={editDriver}
        onDelete={deleteDriverBtn}
      />
      <DeleteAlert
        alertTitle={`آیا از حذف  "${data?.model}"  اطمینان دارید  ؟`}
        isOpen={isDeleting}
        setIsOpen={setIsDeleting}
        actionClick={handleDeleteDriver}
        isLoading={false}
      />
    </>
  );
}
