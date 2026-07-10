import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntitySelector } from "./EntitySelector";
import {
  mapCustomerOptions,
  mapDriverOptions,
  mapVehicleOptions,
  mapLocationOptions,
} from "./schema";
import { toItems } from "@/hooks/use-entity-picker";
import type { CustomerDetail } from "@/_libs/types/customer-types";
import type { DriverResponse } from "@/_libs/types/driver-types";
import type { VehicleResponse } from "@/_libs/types/vehicle-types";
import type { LocationDetail } from "@/_libs/types/location-types";

interface PickerBundle {
  search: string;
  setSearch: (value: string) => void;
  setModalOpen: (value: boolean) => void;
  data: unknown;
  loading: boolean;
}

interface EntitiesSectionProps {
  control: any;
  errors: any;
  sender: PickerBundle;
  receiver: PickerBundle;
  driver: PickerBundle;
  vehicle: PickerBundle;
  origin: PickerBundle;
  destination: PickerBundle;
  isVehicleFixed: boolean;
}

export function EntitiesSection({
  control,
  errors,
  sender,
  receiver,
  driver,
  vehicle,
  origin,
  destination,
  isVehicleFixed,
}: EntitiesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>طرفین و ناوگان حمل</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EntitySelector
          control={control}
          name="sender_id"
          label="فرستنده"
          searchValue={sender.search}
          onSearchChange={sender.setSearch}
          options={mapCustomerOptions(toItems<CustomerDetail>(sender.data))}
          onAddNew={() => sender.setModalOpen(true)}
          loading={sender.loading}
          error={errors.sender_id?.message}
        />

        <EntitySelector
          control={control}
          name="receiver_id"
          label="گیرنده"
          searchValue={receiver.search}
          onSearchChange={receiver.setSearch}
          options={mapCustomerOptions(toItems<CustomerDetail>(receiver.data))}
          onAddNew={() => receiver.setModalOpen(true)}
          loading={receiver.loading}
          error={errors.receiver_id?.message}
        />

        <EntitySelector
          control={control}
          name="driver_id"
          label="راننده"
          searchValue={driver.search}
          onSearchChange={driver.setSearch}
          options={mapDriverOptions(toItems<DriverResponse>(driver.data))}
          onAddNew={() => driver.setModalOpen(true)}
          loading={driver.loading}
          error={errors.driver_id?.message}
        />

        <EntitySelector
          control={control}
          name="vehicle_id"
          label="وسیله نقلیه"
          searchValue={vehicle.search}
          onSearchChange={vehicle.setSearch}
          options={mapVehicleOptions(toItems<VehicleResponse>(vehicle.data))}
          onAddNew={() => vehicle.setModalOpen(true)}
          loading={vehicle.loading}
          disabled={isVehicleFixed}
          placeholder={
            isVehicleFixed
              ? "خودکار بر اساس راننده انتخاب شد"
              : "وسیله نقلیه را انتخاب کنید"
          }
          error={errors.vehicle_id?.message}
        />

        <EntitySelector
          control={control}
          name="origin_location_id"
          label="مبدا"
          searchValue={origin.search}
          onSearchChange={origin.setSearch}
          options={mapLocationOptions(toItems<LocationDetail>(origin.data))}
          onAddNew={() => origin.setModalOpen(true)}
          loading={origin.loading}
          error={errors.origin_location_id?.message}
        />

        <EntitySelector
          control={control}
          name="destination_location_id"
          label="مقصد"
          searchValue={destination.search}
          onSearchChange={destination.setSearch}
          options={mapLocationOptions(
            toItems<LocationDetail>(destination.data),
          )}
          onAddNew={() => destination.setModalOpen(true)}
          loading={destination.loading}
          error={errors.destination_location_id?.message}
        />
      </CardContent>
    </Card>
  );
}
