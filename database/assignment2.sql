-- OVERARCHING TASK 1
-- Task 1: Insert the following record to the account table.
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Task 2: Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Task 3: Delete the Tony Stark record from the account table.
DELETE FROM public.account
WHERE account_id = 1;

-- Task 4: Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Task 5: Use an inner join to select the make and model fields from the inventory table and the classification
-- field from the classification table for inventory items that belong to the "Sport" category. Two records should be
-- returnd as a result of the query.
-- Make sure to include the "table_name.field_name" structure in select element.
SELECT inventory.inv_make, inventory.inv_model FROM public.inventory
INNER JOIN public.classification
	ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Task 6: Update all records in the inventory table to add '/vehicles' to the middle of the file path in the inv_image
-- and inv_thumbnail columns using a single query. When done the path for both inv_image and inv_thumbnail should resemble
-- '/image/vehicles/a-car-name.jpg'.
UPDATE public.inventory
	SET 
	inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- Task 7: When done, copy/paste queries 4-6 to the db-sql-code.sql to add the file rebuild. They should be last queries in this file.