FROM public.ecr.aws/lambda/nodejs:20
RUN dnf install git graphviz -y
COPY app.js package*.json ${LAMBDA_TASK_ROOT}
COPY src ${LAMBDA_TASK_ROOT}/src

RUN npm install
CMD ["app.handler"]