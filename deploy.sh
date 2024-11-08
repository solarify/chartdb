VERSION="lab"
PROJECT="solarify-dwh-${VERSION}"
BUCKET_NAME="${PROJECT}.appspot.com"
SERVICE_ACCOUNT="deploy@solarify-dwh-lab.iam.gserviceaccount.com"
REGION="europe-west"
gcloud auth activate-service-account --key-file=solarify-dwh-lab-2ce1c8d648e9.json 
gcloud app deploy app.yaml --project $PROJECT --bucket=gs://$BUCKET_NAME --account=$SERVICE_ACCOUNT