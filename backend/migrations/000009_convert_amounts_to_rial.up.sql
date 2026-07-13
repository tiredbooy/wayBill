UPDATE waybill
SET freight_charge = freight_charge * 10,
    insurance_amount = insurance_amount * 10,
    other_charges = other_charges * 10,
    total_amount = total_amount * 10;

UPDATE payment
SET amount = amount * 10;
