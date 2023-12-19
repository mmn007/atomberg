import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { AtombergHomebridgePlatform } from './platform';
import { Buffer } from 'buffer';
const dgram = require('dgram');

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class AtombergPlatformAccessory {
  private service: Service;

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private fanStates = {
    Active: 0,
    RotationSpeed: 40
  };

  constructor(
    private readonly platform: AtombergHomebridgePlatform,
    private readonly accessory: PlatformAccessory
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Atomberg')
      .setCharacteristic(this.platform.Characteristic.Model, 'Aria')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the LightBulb service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.Fanv2) || this.accessory.addService(this.platform.Service.Fanv2);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, this.accessory.context.device.displayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(this.setActive.bind(this))                // SET - bind to the `setOn` method below
      .onGet(this.getActive.bind(this));               // GET - bind to the `getOn` method below

    message = Buffer.from(this.accessory.context.device.offCode);
    this.platform.log.info('Set Active for ', this.accessory.context.device.ipAddress, ' with ', message);
    const client = dgram.createSocket('udp4');
    client.send(message,0,message.length, 5600, this.accessory.context.device.ipAddress, (err) => {
        this.platform.log.error("Error happened ", err);
        client.close();
    });
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setActive(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    this.fanStates.Active = value as number;
    this.platform.log.info('Set Active for ', this.accessory.context.device.ipAddress, ' as ', value);
    var message = Buffer.from(this.accessory.context.device.onCode);
    if(value == 0) {
      message = Buffer.from(this.accessory.context.device.offCode);
    }
    this.platform.log.info('Set Active for ', this.accessory.context.device.ipAddress, ' with ', message);
    const client = dgram.createSocket('udp4');
    client.send(message,0,message.length, 5600, this.accessory.context.device.ipAddress, (err) => {
        this.platform.log.error("Error happened ", err);
        client.close();
    });
    this.platform.log.debug('Set Characteristic Active ->', value);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getActive(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    const isOn = this.fanStates.Active;

    this.platform.log.debug('Get Characteristic Active ->', isOn);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return isOn;
  }
}
