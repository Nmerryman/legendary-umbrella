FROM python:3.13-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r /code/requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]