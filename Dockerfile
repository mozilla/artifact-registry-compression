FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:stable

RUN apt-get update && \
  apt-get install -y curl xz-utils && \
  rm -rf /var/lib/apt/lists/*

COPY compress.sh .

CMD [ "./compress.sh" ]
