import time
from threading import Thread


class Timer:
    def __init__(self, time):
        self.time = time

    def get_time(self):
        return self.time

    def set_time(self, time):
        self.time = time

    def __start_count_down(self):
        while self.time:
            time.sleep(1)
            self.time -= 1

    def count_down(self):
        Thread(target=self.__start_count_down).start()
