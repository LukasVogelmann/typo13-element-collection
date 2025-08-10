import Hero from './ContentBlocks/Hero';
import Quote from './ContentBlocks/Quote';
import Award from './ContentBlocks/Award';
import Membership from './ContentBlocks/Membership';
import Accordion from './ContentBlocks/Accordion';
import Fact from './ContentBlocks/Fact';
import Teaser from './ContentBlocks/Teaser';
import Process from './ContentBlocks/Process';
import Newsteaser from './ContentBlocks/Newsteaser';
import ProfileDisplayer from './ContentBlocks/ProfileDisplayer';
import Gallery from './ContentBlocks/Gallery';
import Material from './ContentBlocks/Material';
import Producttype from './ContentBlocks/Producttype';
import DynamicGallery from './ContentBlocks/DynamicGallery';
import Technicaldetail from './ContentBlocks/Technicaldetail';
import Separator from './ContentBlocks/Separator';
import SubHero from './ContentBlocks/SubHero';
import Tabs from './ContentBlocks/Tabs';
import Textimage from './ContentBlocks/Textimage';
import Table from './ContentBlocks/Table';
import Customisation from './ContentBlocks/Customisation';
import jobListManager from './ContentBlocks/JobListManager';
import Banner from './ContentBlocks/Banner';
import Linkbox from './ContentBlocks/Linkbox';

import { Swiper } from 'swiper';
export { Swiper };
import { Pagination, Autoplay, FreeMode, Navigation } from 'swiper/modules';
export { Pagination, Autoplay, FreeMode, Navigation };
import { Splide } from '@splidejs/splide';
export { Splide };

export default class ContentBlocks {
    constructor() {
        new Hero();
        new Quote();
        new Award();
        new Membership();
        new Accordion();
        new Fact();
        new Teaser();
        new Process();
        new Newsteaser();
        new ProfileDisplayer();
        new Gallery();
        new Material();
        new Producttype();
        new Separator();
        new DynamicGallery();
        new SubHero();
        new Technicaldetail();
        new Tabs();
        new Textimage();
        new Table();
        new Customisation();
        new jobListManager();
        new Banner();
        new Linkbox();
    }
}
