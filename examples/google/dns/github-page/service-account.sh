
echo "Create Service Account"
export GOOGLE_PROJECT=grucloud-github-page
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/${GOOGLE_PROJECT}.json
export GOOGLE_SERVICE_ACCOUNT=sa-${GOOGLE_PROJECT}

gcloud iam service-accounts create ${GOOGLE_SERVICE_ACCOUNT} --display-name "grucloud admin account"
gcloud iam service-accounts keys create ${GOOGLE_APPLICATION_CREDENTIALS} --iam-account ${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com

# Add policy binding
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/iam.serviceAccountAdmin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/compute.admin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/storage.admin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/network.admin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/dns.admin
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/editor
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:${GOOGLE_SERVICE_ACCOUNT}@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role roles/resourcemanager.projectIamAdmin

