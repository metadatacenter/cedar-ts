import {templateId, type TemplateId} from "./identity.js";
import {template, type TemplateInit} from "./template.js";


function doSomething() : void {
    let templateId = templateId("https://example.org/templateX");
    template({
        id : templateId,
        metadata: {
            artifact : {
                kind : "artifact_metadata",
                annotations : [],
                descriptive : {
                    alternativeLabels : []
                },
                provenance : {

                }
            },
            versioning : {
                kind : "schema_versioning",
                modelVersion : "2.0.0",
                version : "1.0.1",
                status : "draft"
            }
        },
        header : "",
        footer : "",
        embedded : []
    })
}