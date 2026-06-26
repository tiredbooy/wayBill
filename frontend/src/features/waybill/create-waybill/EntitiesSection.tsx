import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntitySelector } from "./EntitySelector";
import {
  mapCustomerOptions,
  mapDriverOptions,
  mapVehicleOptions,
  mapLocationOptions,
} from "./schema";
import type { CustomerDetail } from "@/_libs/types/customer-types";
import type { DriverResponse } from "@/_libs/types/driver-types";
import type { VehicleResponse } from "@/_libs/types/vehicle-types";
import type { LocationDetail } from "@/_libs/types/location-types";

interface EntitiesSectionProps {
  control: any;
  errors: any;
  senderSearch: string;
  setSenderSearch: (value: string) => void;
  senders: { results?: CustomerDetail[] } | undefined;
  sendersLoading: boolean;
  setSenderOpen: (value: boolean) => void;
  receiverSearch: string;
  setReceiverSearch: (value: string) => void;
  receivers: { results?: CustomerDetail[] } | undefined;
  receiversLoading: boolean;
  setReceiverOpen: (value: boolean) => void;
  driverSearch: string;
  setDriverSearch: (value: string) => void;
  drivers: { results?: DriverResponse[] } | undefined;
  driversLoading: boolean;
  setDriverOpen: (value: boolean) => void;
  vehicleSearch: string;
  setVehicleSearch: (value: string) => void;
  vehicles: { results?: VehicleResponse[] } | undefined;
  vehiclesLoading: boolean;
  isVehicleFixed: boolean;
  setVehicleOpen: (value: boolean) => void;
  originSearch: string;
  setOriginSearch: (value: string) => void;
  originLocations: LocationDetail[] | undefined;
  originLoading: boolean;
  setOriginOpen: (value: boolean) => void;
  destSearch: string;
  setDestSearch: (value: string) => void;
  destLocations: LocationDetail[] | undefined;
  destLoading: boolean;
  setDestOpen: (value: boolean) => void;
}

export function EntitiesSection({
  control,
  errors,
  senderSearch,
  setSenderSearch,
  senders,
  sendersLoading,
  setSenderOpen,
  receiverSearch,
  setReceiverSearch,
  receivers,
  receiversLoading,
  setReceiverOpen,
  driverSearch,
  setDriverSearch,
  drivers,
  driversLoading,
  setDriverOpen,
  vehicleSearch,
  setVehicleSearch,
  vehicles,
  vehiclesLoading,
  setVehicleOpen,
  isVehicleFixed,
  originSearch,
  setOriginSearch,
  originLocations,
  originLoading,
  setOriginOpen,
  destSearch,
  setDestSearch,
  destLocations,
  destLoading,
  setDestOpen,
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
          searchValue={senderSearch}
          onSearchChange={setSenderSearch}
          options={mapCustomerOptions(senders?.results)}
          onAddNew={() => setSenderOpen(true)}
          loading={sendersLoading}
          error={errors.sender_id?.message}
        />

        <EntitySelector
          control={control}
          name="receiver_id"
          label="گیرنده"
          searchValue={receiverSearch}
          onSearchChange={setReceiverSearch}
          options={mapCustomerOptions(receivers?.results)}
          onAddNew={() => setReceiverOpen(true)}
          loading={receiversLoading}
          error={errors.receiver_id?.message}
        />

        <EntitySelector
          control={control}
          name="driver_id"
          label="راننده"
          searchValue={driverSearch}
          onSearchChange={setDriverSearch}
          options={mapDriverOptions(drivers?.results)}
          onAddNew={() => setDriverOpen(true)}
          loading={driversLoading}
          error={errors.driver_id?.message}
        />

        <EntitySelector
          control={control}
          name="vehicle_id"
          label="وسیله نقلیه"
          searchValue={vehicleSearch}
          onSearchChange={setVehicleSearch}
          options={mapVehicleOptions(vehicles?.results)}
          onAddNew={() => setVehicleOpen(true)}
          loading={vehiclesLoading}
          disabled={isVehicleFixed}
          placeholder={isVehicleFixed ? "خودکار بر اساس راننده انتخاب شد" : "وسیله نقلیه را انتخاب کنید"}
          error={errors.vehicle_id?.message}
        />

        <EntitySelector
          control={control}
          name="origin_location_id"
          label="مبدا"
          searchValue={originSearch}
          onSearchChange={setOriginSearch}
          options={mapLocationOptions(originLocations)}
          onAddNew={() => setOriginOpen(true)}
          loading={originLoading}
          error={errors.origin_location_id?.message}
        />

        <EntitySelector
          control={control}
          name="destination_location_id"
          label="مقصد"
          searchValue={destSearch}
          onSearchChange={setDestSearch}
          options={mapLocationOptions(destLocations)}
          onAddNew={() => setDestOpen(true)}
          loading={destLoading}
          error={errors.destination_location_id?.message}
        />
      </CardContent>
    </Card>
  );
}
