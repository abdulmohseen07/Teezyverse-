import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  // ✅ Generate AI Image using Backend API (Fixed)
  const handleSubmit = async (type) => {
    if (!prompt) return alert("❌ Please enter a prompt");
  
    try {
      setGeneratingImg(true);
  
      const apiUrl = "http://localhost:8080/api/gemini/image"; 
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
  
      console.log("✅ API Response Status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error Data:", errorData);
        throw new Error(errorData.message || "API Error");
      }
  
      const data = await response.json();
      console.log("✅ Image Generated:", data.image);
  
      handleDecals(type, data.image);
    } catch (error) {
      console.error("❌ Image Generation Error:", error);
      alert("Error generating image: " + error.message);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };
  
  
  

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
  
    if (type === "full") {
      state.isFullTexture = true;  // ✅ Ensures full image is used
      state.isLogoTexture = false;
    }
  
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };
  

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        state.isFullTexture = false;
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        state.isLogoTexture = false;  // Ensure only full texture is used
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
  
    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };
  

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  // Show tab content dynamically
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Sidebar for Customization */}
          <motion.div key="custom" className="absolute top-0 left-0 z-10" {...slideAnimation("left")}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab key={tab.name} tab={tab} handleClick={() => setActiveEditorTab(tab.name)} />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          {/* Go Back Button */}
          <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          {/* Filter Tabs */}
          <motion.div className="filtertabs-container" {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
