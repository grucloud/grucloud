
echo "Create Service Account"
export GOOGLE_PROJECT=grucloud-e2e
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/grucloud.json

gcloud iam service-accounts create grucloud --display-name "grucloud admin account"
gcloud iam service-accounts keys create ${GOOGLE_APPLICATION_CREDENTIALS} --iam-account grucloud@${GOOGLE_PROJECT}.iam.gserviceaccount.com

# Add policy binding
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:grucloud@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/iam.serviceAccountAdmin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:grucloud@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/compute.admin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:grucloud@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/storage.admin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:grucloud@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/editor
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:grucloud@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/resourcemanager.projectIamAdmin

