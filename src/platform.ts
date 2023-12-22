import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { AtombergPlatformAccessory } from './platformAccessory';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class AtombergHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.name);

    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  discoverDevices() {

    // EXAMPLE ONLY
    // A real plugin you would discover accessories from the local network, cloud services
    // or a user-defined array in the platform config.
    const fans = [
      {
        name: 'office_fan',
        displayName: 'Office Fan',
        room: 'Office Room',
        ipAddress: '192.168.0.130',
        onCode: '6k7YIXymYAyHEz7623jyRKSSUasCK7K7BLHjjBmf5Ymt6TB55xQ2W5objJbfzhUcuW+eKjhqV12galP6',
        offCode:'50hGBamtsr6siOc6NnXFLv2U/n0QCDFqUK9DZNCHvWCJdaD9N+RD0ZdX8yOTsTDAcd3spP5q6tz9JKlX'
      },
      {
        name: 'nonu_fan',
        displayName: 'Nonu Bedroom Fan',
        room: 'Nonu Bedroom',
        ipAddress: '192.168.0.136',
        onCode: 'Jmlu57pzGTgX9X3xbpZt6n2bmyTDdV4dDq2vCBW3WNBmzhdCSs8RWBsqiv0YyK2wf9lmLigyGDuudOu+',
        offCode:'fM3SJ3B1jWm8332Ww3btwQMituSX3x9EFWvesok4JYBSXy9Fg2JHXWu6HkKSHDhhK2FKROLWFc14yqQi'
      },
      {
        name: 'master_br_fan',
        displayName: 'Master Bedroom Fan',
        room: 'Master Bedroom',
        ipAddress: '192.168.0.172',
        onCode:'LDq3ylQ7WqCTYnB1SsJjZ3tqVAo5ISy4AiVEy/VtAy60LHn4VnCfGaPbtYFJFRcRA1nkIyg+fHTXhXE2',
        offCode:'E2IJutPXeGXl9CvWean8exDGHs/tGsv1HSScvOC1n50SvrPdYEo3W6k51tjRmbNT5kKUWSPfbrEhqkbL'
      },
      {
        name: 'family_lr_fan',
        displayName: 'Family Living Room Fan',
        room: 'Family Living Room',
        ipAddress: '192.168.0.152',
        onCode: 'I3WiRtEq6QxfcQVcvdU3YefM+nohPALryGu0CdmAIhXckVODMWvQSfSS7WYDsPGM6PAoEtVd4SidUKYU',
        offCode:'viiJxRKRG8RvPqasuug5ENtFuPDGYZ2aZewSBStz07yb18WalE7N77gSfubXdRGXIpqS6eJfmuhoxBt/'
      },
      {
        name: 'dining_fan',
        displayName: 'Dining Room Fan',
        room: 'Dining Room',
        ipAddress: '192.168.0.109',
        onCode: '8kqh0xtRYxHVWjjbA0NQ+midIvwYuDUKTaOCGBF9MSgrys/CckUmVSjCSpm+SzX+MqY1HiQCQEDHOb6x',
        offCode:'nLneZTXfaO5s7CPbi6yTs9vIzwC0RR9opoOwrizYoFXlF8sS98lbNTuVJIdoMgkjWAPI2Z+VZEWNsR+Y'
      },
      {
        name: 'ikkuru_fan',
        displayName: 'Ikkuru Bedroom Fan',
        room: 'Ikkuru Bedroom',
        ipAddress: '192.168.0.187',
        onCode: 'vlXqIk84aO0g4De2Zxv9Ttt3BZCt413j0GxRiQvcGKpwx55P6Cfed+ygUvERPSz3WCssLULQor6fql3P',
        offCode:'m3kQJ06zR1xzll4qPVAX4ZjkS6X4VwScwE38WrqmnWNOb6FWycgVZrc76DExxIWkgnxPC3HaSRF/kOLE'
      },
      {
        name: 'guest_fan',
        displayName: 'Guest Bedroom Fan',
        room: 'Guest Bedroom',
        ipAddress: '192.168.0.238',
        onCode: 'X51JX2u82xpS6g1aTb95oyCmhLDR6jMU2q0uHn3v8ZG7CKknjbtT+nJXWjQe5wEYBn9rcd4pBEwAE0Ay',
        offCode:'N446tZHNtQUgt1sC9aMIjsi9nPG1QNJ8nZDYv/tBUYHCF9wA95iBd5jmfqYdXLjJECZ9uYMooeqv8paO'
      },

    ];

    // loop over the discovered devices and register each one if it has not already been registered
    for (const device of fans) {

      // generate a unique id for the accessory this should be generated from
      // something globally unique, but constant, for example, the device serial
      // number or MAC address
      const uuid = this.api.hap.uuid.generate(device.name);

      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (existingAccessory) {
        // the accessory already exists
        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

        // if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
        // existingAccessory.context.device = device;
        // this.api.updatePlatformAccessories([existingAccessory]);

        // create the accessory handler for the restored accessory
        // this is imported from `platformAccessory.ts`
        new AtombergPlatformAccessory(this, existingAccessory);

        // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
        // remove platform accessories when no longer present
        // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
        // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
      } else {

        // the accessory does not yet exist, so we need to create it
        this.log.info('Adding new accessory:', device.displayName);

        // create a new accessory
        const accessory = new this.api.platformAccessory(device.displayName, uuid);

        // store a copy of the device object in the `accessory.context`
        // the `context` property can be used to store any data about the accessory you may need
        accessory.context.device = device;

        // create the accessory handler for the newly create accessory
        // this is imported from `platformAccessory.ts`
        new AtombergPlatformAccessory(this, accessory);

        // link the accessory to your platform
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }
}
