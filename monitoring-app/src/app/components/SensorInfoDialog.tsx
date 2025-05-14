import { Dispatch, SetStateAction, useRef } from "react";
import styles from "./SensorInfoDialog.module.css";
import { Xicon } from "./icons/xicon";
import { SoilMoistureIcon } from "./icons/SoilMoistureIcon";
import { SoilPhIcon } from "./icons/SoilPhIcon";
import { SoilTemperatureIcon } from "./icons/SoilTemperatureIcon";
import { WaterLevelIcon } from "./icons/WaterLevelIcon";
import { LuminosityIcon } from "./icons/LuminosityIcon";
import { AirTemperatureIcon } from "./icons/AirTemperatureIcon";
import { AirHumidityIcon } from "./icons/AirHumidityIcon";
import { WaterOverFlowIcon } from "./icons/WaterOverFlowIcon";

type SensorInfoDialogProps = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
};

export const SensorInfoDialog = ({
  showDialog,
  setShowDialog,
}: SensorInfoDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  return (
    <dialog open={showDialog} className={styles.dialog} ref={dialogRef}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Sensors and their values</h2>
          <button
            className={styles.closeDialogBtn}
            onClick={() => {
              dialogRef.current?.close();
              setShowDialog(false);
            }}
          >
            <Xicon />
          </button>
        </header>
        <div className={styles.content}>
          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <SoilMoistureIcon />
            </div>
            <h3>Soil moisture (0-100%)</h3>
            <h4>What is soil moisture?</h4>
            <p>
              This term refers to the entire quantity of water in the
              soil&apos;s pores or on its surface. Soil moisture is affected by
              the texture, structure, density, salinity, organic matter content
              and depth of the soil, as well as the temperature.
            </p>
            <h4>Where can it be measured best?</h4>
            <p>
              Soil moisture changes with soil depth. The best depth for
              measuring is 2,5-6 cm from the surface. Moisture data closer to
              the roots is more informative.
            </p>
            <h4>What is an ideal % of soil moisture?</h4>
            <p>
              The majority of potted house plants need 21-40% soil moisture to
              be healthy. Cacti and succulents like soil moisture &gt; 20%. Some
              water-loving plants might need a soil moisture of 40-60%, but in
              general no plant needs more than 80%.
            </p>
          </div>

          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <SoilPhIcon />
            </div>
            <h3>Soil PH (0-14)</h3>
            <h4>What is soil pH? </h4>
            <p>
              Soil pH is a measure of the acidity or alkalinity of the soil.
              Soils can be classified according to their pH value: 6.5 to
              7.5—neutral, over 7.5—alkaline, less than 6.5—acidic, and soils
              with pH less than 5.5 are considered strongly acidic.
            </p>
            <h4>What is a good soil pH value?</h4>
            <p>
              The majority of house plants do well when the soil pH is between
              6.2 and 6.8.
            </p>
            <h4>Are there visible signs of not ideal soil pH values?</h4>
            <p>
              Common signs of low pH are stunted growth and twisted, yellow,
              dying leaves. If the pH is too high, the leaves usually have brown
              spots and start to turn brown on the edges and on the tips.
            </p>
            <h4>How can the pH values get fixed?</h4>
            <p>
              If the pH is too low, a lime application, baking soda, or a
              component high in calcium like eggshells can be added to increase
              the pH in the soil. If the pH is too high, adding an acidic
              treatment such as sulfur, aluminum sulfate, or sulfuric acid will
              buffer the pH level.
            </p>
          </div>

          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <SoilTemperatureIcon />
            </div>
            <h3>Soil temperature (°C)</h3>
            <h4>Why is soil temperature important?</h4>

            <p>
              If the temperature is off, it can cause some serious problems and
              limit the plant&acute;s growth potential. If the soil temperature
              drops too low, it can slow down the plant&acute;s metabolic,
              resulting in stunted growth for both roots and leaves, delayed
              flowering, and reduced fruit or seed production. High temperatures
              can cause plants to lose too much water through transpiration,
              leading to wilting, hindering nutrient absorption and a risk for
              root rot.
            </p>
            <h4>What is the ideal soil temperature?</h4>
            <p>Most houseplants prefer a soil temperature between 15-24°C.</p>
            <h4>How to affect the soil temperature?</h4>
            <p>
              Relocating the plant is the easiest and fastest way to affect the
              soil temperature, but repotting (smaller containers tend to heat
              up more quickly than larger ones) or adjusting the watering
              frequency (watering less frequently if the soil temperature is too
              low and more often is it&acute;s too high) can help as well.
            </p>
          </div>
          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <WaterLevelIcon />
            </div>
            <h3>Water level (0-100%)</h3>
            <p>
              The water level of the IoT-pot water tank.
              <ul style={{ marginTop: "3.5rem" }}>
                <li>
                  <b>&lt; 10%:</b> almost empty, pump won&apos;t start, device
                  LED will flash red quickly.
                </li>
                <li>
                  <b>&gt; 10% and &lt; 20%:</b> low level, device LED will shine
                  red.
                </li>
                <li>
                  <b>&gt; 20% and &lt; 40%:</b> ok, device LED will shine
                  orange.
                </li>
                <li>
                  <b>&gt; 40% and &lt; 60%:</b> ok, device LED will shine green.
                </li>
                <li>
                  <b>&gt; 60%:</b> too much water, device LED will flash red.
                </li>
              </ul>
            </p>
          </div>
          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <LuminosityIcon />
            </div>
            <h3>Luminosity (Lux)</h3>
            <h4>What is luminosity?</h4>
            <p>
              Plants need light to photosynthesize, certain plants only start
              flowering with the right amount of light, and others burn if they
              are in direct sunlight. In general, if your plants don&acute;t get
              adequate lighting they shrivel and die. Quality of light can be
              measured in intensity (how strong the light is) and amount (how
              many hours). Light intensity is measured in units called Lux.
            </p>
            <h4>What do the Lux-measurements mean?</h4>
            <p>
              To give an idea of Lux amounts: office lightning is usually
              approx. 320-550 Lux, full daylight approx. 10000-25000 Lux, and
              direct sunlight is 32000-100000 Lux.
            </p>
            <p>
              Low light plants need 500-2500 Lux, medium light plants 2500-10000
              Lux, bright light plants 10000-20000 Lux, and very bright light
              plants 20000-50000 Lux.
            </p>
            <p>
              Most plants will survive at 10x lower values than specified but
              they won&acute;t thrive.
            </p>
            <h4>Where should I place my plant for optimum light?</h4>
            <p>
              Bright light:(e.g. Aloe, Hibiscus, most herbs): right next to a
              north or south-facing window; bright indirect light (e.g. Begonia,
              Christmas cactus, Orchids, Succulents): any place where the plant
              will get a few hours of sun during the day but not the whole day;
              medium light/partly shaded (e.g. Philodendrons, Rubber plant): the
              plant gets some morning sun or some afternoon sun; low light /
              shady (e.g. Bamboo palm, Monstera): the plant doesn&acute;t get
              direct sun, usually north facing windows.
            </p>
            <p>
              Check your plants ideal light conditions from a reliable source.
              Please note that plants also need darkness (flowering and growth
              is triggered by the changes in daylight hours), in general 8 hours
              a day!
            </p>
          </div>

          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <AirTemperatureIcon />
            </div>
            <h3>Air Temperature (°C)</h3>
            <h4>How important is air temperature for plants?</h4>
            <p>
              Temperature is one of the key factors in plant growth and
              development. It affects their ability to perform essential
              functions such as photosynthesis, respiration and nutrient uptake.
              Plants have an optimal temperature range in which they can thrive,
              and if they are exposed to temperatures that are too high or too
              low, their health can be compromised.
            </p>
            <h4>What is an ideal temperature for indoor plants?</h4>
            <p>
              Houseplants can adapt to different climatic conditions, but when
              temperatures fall below certain levels or rise too high, the
              damage can be irreparable.
            </p>
            <p>
              Excessive heat can cause dehydration, leaf burn and abnormal
              growth. On the other hand, intense cold (under 7°C) can slow down
              their metabolism, causing them to go &quot;dormant&quot;.
            </p>
            <p>
              {" "}
              The ideal temperature range for indoor plants is usually between
              18 and 24 degrees Celsius. In general, this is a safe range for
              most species.
            </p>
          </div>

          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <AirHumidityIcon />
            </div>
            <h3>AIR HUMIDITY (%) </h3>

            <h4>What is air humidity and why is it important?</h4>
            <p>
              Humidity, simply put, is the measure of moisture in the air. If
              the air is too dry, the plant might get parched and droopy, while
              excess moisture can lead to fungal issues and unhappy roots.
              Keeping a balanced humidity level, which varies depending on the
              plant type, helps the plant breathe easy and absorb nutrients
              better.
            </p>
            <h4>What is a good air humidity percentage?</h4>
            <p>
              Low humidity (10-40%): Cacti and succulents will do well, but most
              plants will have leaf problems. Moderate humidity (40-60%): Most
              common houseplants thrive in this range. Most homes have this
              level of humidity in the summer. High humidity (60-80%): This is
              ideal for almost all tropical indoor plants, however, it is
              difficult to maintain indoors. You can maintain this level with an
              enclosed terrarium or small greenhouse. Very high humidity
              (80-90%): Few houseplants will need humidity this high, but it
              could suit some very specific tropical plants like certain orchids
              and carnivorous plants. For humans, however, it is not healthy at
              all! Only greenhouses or enclosed environments can achieve this
              level of humidity.
            </p>
            <h4>How can I affect the air humidity?</h4>
            <p>
              Most indoor environments lack sufficient humidity for healthy
              indoor plants, particularly in the winter. Also air conditioning
              dries out the environment, which can affect the humidity of the
              plants. So with the exception of the cacti and succulents, all
              indoor plants benefit from treatments to raise the humidity in
              their vicinity.
            </p>
            <p>
              It is questionable whether misting plants really increases
              humidity. If you decide to do so use tepid water and mist early in
              the day so the leaves dry before evening. An alternative is to
              place pots on a tray filled with pebbles and water to increase
              humidity in the area around the plants. If you group plants
              together in a room, they will collectively raise the humidity in
              their area.
            </p>
          </div>

          <div className={styles.sensorInfoItem}>
            <div className={styles.sensorIcon}>
              <WaterOverFlowIcon />
            </div>
            <h3>Water OVERFLOW (0-1) </h3>
            <p>
              The overflow sensor of the IoT-pot device detects if water from
              watering the plant has overflowed. A red LED will illuminate above
              the water drop symbol on the device cover if overflow has been
              detected.
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
};
