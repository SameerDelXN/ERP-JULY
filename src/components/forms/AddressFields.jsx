import React from "react";
import FormField from "./FormField";
import { MapPin } from "lucide-react";

const AddressFields = ({ control, errors, index }) => (
    <div className="space-y-4 border border-gray-200 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700">
            Address {index > 0 ? index + 1 : ""}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name={`address[${index}].addressLine`}
                label="Address Line"
                type="text"
                error={errors.address?.[index]?.addressLine}
                maxLength={200}
            />
            <FormField
                control={control}
                name={`address[${index}].city`}
                label="City"
                type="text"
                alphaOnly={true}
                error={errors.address?.[index]?.city}
                maxLength={50}
                pattern={{
                    value: /^[a-zA-Z\s]*$/,
                    message: "Only alphabets are allowed",
                }}
            />
            <FormField
                control={control}
                name={`address[${index}].state`}
                label="State"
                type="text"
                alphaOnly={true}
                error={errors.address?.[index]?.state}
                maxLength={50}
                pattern={{
                    value: /^[a-zA-Z\s]*$/,
                    message: "Only alphabets are allowed",
                }}
            />
            <FormField
                control={control}
                name={`address[${index}].pincode`}
                label="Pincode"
                type="number"
                error={errors.address?.[index]?.pincode}
                numericOnly={true}
                minLength={6}
                maxLength={6}
                pattern={{
                    value: /^[0-9]{6}$/,
                    message: "Must be a valid 6-digit pincode",
                }}
            />
            <FormField
                control={control}
                name={`address[${index}].country`}
                label="Country"
                type="text"
                alphaOnly={true}
                error={errors.address?.[index]?.country}
                maxLength={50}
                pattern={{
                    value: /^[a-zA-Z\s]*$/,
                    message: "Only alphabets are allowed",
                }}
            />
        </div>
    </div>
);

export default AddressFields;
