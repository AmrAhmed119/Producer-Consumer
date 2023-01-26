import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProducerConsumerService {

  private URL: string = "http://localhost:8080/api/producer_consumer/";

  constructor(private http: HttpClient) {
  }

  public addMachine() {
    this.http.post(URL + "addMachine", {}).subscribe();
  }

  public addQueue() {
    this.http.post(URL + "addQueue", {}).subscribe();
  }

  public addProduct() {
    this.http.post(URL + "addProduct", {}).subscribe();
  }

  public connectMachineToQueue(machineId: string, queueId: string) {
    return this.http.post(URL + "connectMtoQ", {
      "machine_id": machineId,
      "queue_id": queueId
    });
  }

  public connectQueueToMachine(machineId: string, queueId: string) {
    return this.http.post(URL + "connectQtoM", {
      "machine_id": machineId,
      "queue_id": queueId
    });
  }


  public start() {
    this.http.post(URL + "start", {}).subscribe();
  }

  public replay() {
    this.http.post(URL + "replay", {}).subscribe();
  }

}
