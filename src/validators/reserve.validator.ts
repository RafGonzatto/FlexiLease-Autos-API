import { z } from 'zod';
import { parse, isValid } from 'date-fns';

const isValidDateFormat = (dateStr: string) => {
    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate) && parsedDate.getDate() === parseInt(dateStr.slice(0, 2), 10);
};

const reserveSchema = z.object({
    id_user: z.string().nonempty({ message: "User ID is required" }),
    start_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "Start date must follow the format DD/MM/YYYY" })
        .nonempty({ message: "Start date is required" })
        .refine(isValidDateFormat, { message: "Invalid start date format. Please use the format DD/MM/YYYY" }),
    end_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "End date must follow the format DD/MM/YYYY" })
        .nonempty({ message: "End date is required" })
        .refine(isValidDateFormat, { message: "Invalid end date format. Please use the format DD/MM/YYYY" }),
    id_car: z.string().nonempty({ message: "Car ID is required" }),
}).refine(data => {
    const startDate = parse(data.start_date, 'dd/MM/yyyy', new Date());
    const endDate = parse(data.end_date, 'dd/MM/yyyy', new Date());
    return startDate <= endDate;
}, {
    message: 'Start date must be before or equal to end date',
    path: ['start_date', 'end_date'],
});

export { reserveSchema };
