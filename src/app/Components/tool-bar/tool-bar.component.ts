import {Component, OnInit} from '@angular/core';
import {Konva} from "konva/cmj/_FullInternals";
import {ProducerConsumerService} from "../../producer-consumer.service";
import {StompService} from "../../stomp.service";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  constructor(private producerConsumerService: ProducerConsumerService,
              private stompService: StompService) {
  }

  stage: any;
  layer: any;
  machineNumber: number = 1;
  queueNumber: number = 1;
  drawLine: boolean = false;
  shape1: any;
  shape2: any;
  productsNum: number = 0;
  workingmachine:any;
  productcolor:any[]=[];
  interval:any;

  ngOnInit(): void {

    this.stompService.subscribe('/topic/notify', (data: any): any => {
      this.chooseOperation(data.body)
    });

    let width = window.innerWidth * (80 / 100);
    let height = window.innerHeight * (93 / 100);
    this.stage = new Konva.Stage({
      container: 'board',
      width: width,
      height: height,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.on("click", (event: any) => {
      if (!this.drawLine) {
        return;
      }
      else if(this.drawLine) {
        console.log("asdfasdfasdfasdfasdfasdf");
        if (this.shape1 == null) {
          this.shape1 = event.target;
          this.shape1 = this.shape1.getParent().getChildren()[0];
        } else {
          this.shape2 = event.target;
          this.shape2 = this.shape2.getParent().getChildren()[0];
          this.drawLine = false;
          this.connect(this.shape1, this.shape2);
          return;
        }
      }
    });
  }

  private chooseOperation(data : any) {
    let ob = JSON.parse(data);
    if (ob["operation"] === "updateQueueSize") this.updateQueueSize(ob);
    else if (ob["operation"] === "machineRunning") this.machineRunning(ob);
    else this.machineFinished(ob);
  }

  addQ(event: any) {

    this.layer.add(this.newQueue()).batchDraw();
    this.producerConsumerService.addQueue();

  }

  addM(event: any) {

    this.layer.add(this.newMachine()).batchDraw();
    this.producerConsumerService.addMachine();

  }

  line(event: any) {

    this.drawLine = true;


  }

  connect(shape1: any, shape2: any) {


    let x1 = shape1.getParent().attrs.x, x2 = shape2.getParent().attrs.x;
    let y1 = shape1.getParent().attrs.y, y2 = shape2.getParent().attrs.y;
    let type1 = shape1.getParent().attrs.name;
    let type2 = shape2.getParent().attrs.name;
    let id1 = shape1.getParent().id(), id2 = shape2.getParent().id();
    let a, b, c, d;

    if (type1 === "Rect" && type2 === "Circle") {

      console.log(shape2.getParent().id());
      console.log(shape1.getParent().id());

      this.producerConsumerService.connectQueueToMachine(id2, id1);


      a = x1 + shape1.getParent().attrs.width;
      b = y1 + shape1.getParent().attrs.height / 2;
      c = x2 - shape2.getParent().attrs.width;
      d = y2;

    } else if (type2 === "Rect" && type1 === "Circle") {

      this.producerConsumerService.connectMachineToQueue(id1, id2);

      a = x1 + shape1.getParent().attrs.width - 2;
      b = y1;
      c = x2;
      d = y2 + 26;

    } else {

      this.shape1 = null;
      this.shape2 = null;
      this.drawLine = true;
      return;

    }

    var arrow = new Konva.Arrow({
      points: [a, b, c, d],
      pointerLength: 8,
      pointerWidth: 8,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
    });

    this.shape1 = null;
    this.shape2 = null;
    this.layer.add(arrow).batchDraw();

  }

  newQueue() {

    let group = new Konva.Group({
      x: 100,
      y: 300,
      width: 60,
      height: 60,
      draggable: true,
      id: "Q" + this.queueNumber.toString(),
      name: "Rect"
    });

    let rect = new Konva.Rect({
      fill: "#dedc21",
      border: 15,
      width: 60,
      height: 60,
    });

    let text = new Konva.Text({
      text: 'Q' + this.queueNumber.toString(),
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'black',
      align: 'center',
      padding: 15,
    });

    group.add(rect);
    group.add(text);

    this.queueNumber++;
    return group;
  }

  newMachine() {

    let group = new Konva.Group({
      x: 100,
      y: 300,
      width: 40,
      height: 40,
      draggable: true,
      id: "M" + this.machineNumber.toString(),
      name: "Circle"
    });

    let circle = new Konva.Circle({
      fill: "#7ac13e",
      radius: 33,
    });

    let text = new Konva.Text({
      text: 'M' + this.machineNumber.toString(),
      fontSize: 27,
      fontFamily: 'Tahoma',
      fill: 'black',
      align: 'left',
      padding: -18
    });

    group.add(circle);
    group.add(text);

    this.machineNumber++;
    return group;
  }

  clear(event: any) {

    this.layer.removeChildren();
    this.productsNum = 0;
    this.machineNumber = 1;
    this.queueNumber = 1;
    this.drawLine = false;
    this.shape1 = null;
    this.shape2 = null;

    this.producerConsumerService.clear();

  }

  addP(event: any) {
    this.productsNum++;
    this.producerConsumerService.addProduct();
  }

  run(event: any) {
    this.producerConsumerService.start();
  }

  replay(event: any) {
    this.producerConsumerService.replay();
  }

  updateQueueSize(data: any) {
    let id : string = data.id;
    let size : string = data.size;

    console.log("SIZEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    console.log(size);
    let group = this.stage.findOne('#' + id.toString());
    let shape = group.getChildren()[1];
    shape.text(size);
    // update queue size
  }

  machineRunning(data: any) {
    console.log("enterred maching running");
    let id = data.id;
    let color = data.color;
    let g = this.stage.findOne(`#` + id.toString());
    this.workingmachine = g.children[0];
    g.children[0].fill(`rgb(${color[0]},${color[1]},${color[2]})`);
  }

  machineFinished(data: any) {
    console.log("aaaaaaaaaa");
    console.log(data);
    let id = data.id;
    let g = this.stage.findOne(`#` + id.toString());
    g.children[0].fill("#7ac13e");
    // return machine to default color;
  }


  flash( machine : any , color : any){
    console.log("Before Flash");
    console.log(machine);
    console.log(color);
    if(machine.fill() === "#7ac13e"){
      machine.fill(`rgb(${color[0]},${color[1]},${color[2]})`);
      console.log("After Flash");
      console.log(machine);
    }
    else{
      machine.fill("#7ac13e");
    }
  }

  stop(event : any) {
    this.producerConsumerService.pause("Q1");
  }

}
