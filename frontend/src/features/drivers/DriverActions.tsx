import { useState } from "react";

import {
  useDeleteDriver,
  useDriver,
} from "@/_libs/services/queries/drivers.queries";
import { useDriverActionStore } from "@/stores/useDriverIdStore";
import { useShallow } from "zustand/react/shallow";
import DeleteAlert from "../reusable/dialog/DeleteAlert";
import ActionDropdown from "../reusable/dialog/ActionsDropdown";
import { useNavigate } from "react-router-dom";

export function DriverActions({ driverID }: { driverID: number }) {
  const { setDriverID } = useDriverActionStore(
    useShallow((s) => ({
      setDriverID: s.setDriverID,
    })),
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { data } = useDriver(Number(driverID));
  const deleteDriver = useDeleteDriver();
  const navigate = useNavigate();

  function viewDriver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setDriverID(Number(driverID));
  }

  function editDriver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/dashboard/drivers/edit/${driverID}`);
  }

  function deleteDriverBtn(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
  }

  function handleDeleteDriver() {
    deleteDriver.mutateAsync(Number(driverID));
    setIsDeleting(false);
  }

  return (
    <>
      <ActionDropdown
        // driverID={Number(driverID)}
        view
        edit
        haveDelete
        onView={viewDriver}
        onEdit={editDriver}
        onDelete={deleteDriverBtn}
      />
      <DeleteAlert
        alertTitle={`آیا از حذف  "${data?.first_name} ${data?.last_name}"  اطمینان دارید  ؟`}
        isOpen={isDeleting}
        setIsOpen={setIsDeleting}
        actionClick={handleDeleteDriver}
        isLoading={deleteDriver.isPending}
      />
    </>
  );
}
