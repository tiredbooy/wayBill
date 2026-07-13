UPDATE waybill
SET freight_charge = freight_charge / 10.0,
    insurance_amount = insurance_amount / 10.0,
    other_charges = other_charges / 10.0,
    total_amount = total_amount / 10.0;

UPDATE payment
SET amount = amount / 10.0;
