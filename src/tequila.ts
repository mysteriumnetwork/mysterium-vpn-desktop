import {TequilapiClient, TequilapiClientFactory} from "mysterium-vpn-js";

const factory = new TequilapiClientFactory("http://localhost:4050")
const tequilapi: TequilapiClient = factory.build(factory.buildAdapter())

export default tequilapi
