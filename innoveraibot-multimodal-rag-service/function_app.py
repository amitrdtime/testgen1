import azure.functions as func
from src.controllers.ai import ai_bp
import datetime
import logging


app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)
app.register_blueprint(ai_bp)

@app.function_name(name="wakeuptimer")
@app.timer_trigger(schedule="*/30 * * * * *", 
              arg_name="wakeuptimer",
              run_on_startup=False) 
def wakeuptimer(wakeuptimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()
    if wakeuptimer.past_due:
        logging.info('The timer is past due!')
    logging.info('Wakeup timer trigger function ran at %s', utc_timestamp)