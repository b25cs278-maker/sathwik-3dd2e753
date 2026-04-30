
-- Remove broad SELECT policy that allowed any client to list all files in module-resources.
DROP POLICY IF EXISTS "Anyone can view module resources" ON storage.objects;

-- Allow only admins to list/SELECT module-resources rows via the API.
-- Anonymous public-URL downloads still work because public buckets serve files
-- directly through the storage CDN without consulting storage.objects RLS.
CREATE POLICY "Admins can list module resources"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'module-resources'
  AND has_role(auth.uid(), 'admin'::app_role)
);
