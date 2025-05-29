import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import './DiagramViewer.css';

const DiagramViewer = ({ diagramType, diagramCode }) => {
  const diagramContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [isRendered, setIsRendered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Initialize mermaid with the right configuration
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      logLevel: 'error',
      fontFamily: 'monospace'
    });

    const renderDiagram = async () => {
      if (!diagramCode || !diagramContainerRef.current) return;
      
      try {
        // Clear previous diagram
        diagramContainerRef.current.innerHTML = '';
        setIsRendered(false);
        
        // Get clean code to work with
        let cleanCode = diagramCode.replace(/```mermaid/g, '').replace(/```/g, '').trim();
        
        // Apply diagram-specific fixes based on type and content
        cleanCode = fixDiagramCode(cleanCode, diagramType);
        
        // Create a unique ID for this diagram
        const id = `mermaid-diagram-${Date.now()}`;
        
        // Create the container with the mermaid class
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.id = id;
        container.textContent = cleanCode;
        diagramContainerRef.current.appendChild(container);

        // Render the diagram
        await mermaid.run();
        setIsRendered(true);
      } catch (error) {
        console.error('Error rendering diagram:', error);
        
        if (diagramContainerRef.current) {
          diagramContainerRef.current.innerHTML = `
            <div class="diagram-error">
              <h4>Error rendering diagram</h4>
              <p>${error.message}</p>
              <div class="alternative-actions">
                <button class="btn-primary btn-sm try-simplified">Display Simplified Version</button>
              </div>
            </div>
          `;
          
          // Add event listener for simplified version
          const simplifyButton = diagramContainerRef.current.querySelector('.try-simplified');
          if (simplifyButton) {
            simplifyButton.addEventListener('click', () => {
              diagramContainerRef.current.innerHTML = '';
              const simplifiedContainer = document.createElement('div');
              simplifiedContainer.className = 'mermaid';
              
              // Generate simplified version based on the diagram type
              const simplifiedDiagram = generateSimplifiedDiagram(diagramType);
              
              simplifiedContainer.textContent = simplifiedDiagram;
              diagramContainerRef.current.appendChild(simplifiedContainer);
              
              // Try rendering the simplified diagram
              mermaid.run().then(() => {
                setIsRendered(true);
                
                // Add note about simplified view
                const note = document.createElement('div');
                note.className = 'diagram-note';
                note.innerHTML = '<p><strong>Note:</strong> Showing a simplified diagram due to rendering issues with the full diagram.</p>';
                diagramContainerRef.current.appendChild(note);
              }).catch(err => {
                console.error("Simplified diagram error:", err);
                diagramContainerRef.current.innerHTML = `
                  <div class="diagram-error">
                    <h4>Still having trouble rendering the diagram</h4>
                    <p>Please try refreshing the page or contact support.</p>
                  </div>
                `;
              });
            });
          }
        }
      }
    };

    // Function to fix diagram code based on type and content
    const fixDiagramCode = (code, type) => {
      let fixedCode = code;
      
      if (type === 'Class Diagram' || type.toLowerCase().includes('class')) {
        // Fix class and interface definitions
        fixedCode = fixedCode.replace(/class\s+([A-Za-z0-9._]+)\s*{}/g, "class $1");
        
        // Fix spacing between class definitions
        fixedCode = fixedCode.split('class ').join('\nclass ').trim();
        
        // Fix for empty classes with dots in their names (common in your diagrams)
        const classNameRegex = /class\s+([A-Za-z0-9._]+)\s*{\s*}/g;
        let match;
        
        while ((match = classNameRegex.exec(code)) !== null) {
          const fullClassName = match[1];
          // Extract just the class name without the namespace
          const classNameParts = fullClassName.split('.');
          const simpleClassName = classNameParts[classNameParts.length - 1];
          
          fixedCode = fixedCode.replace(
            `class ${fullClassName} {}`, 
            `class ${simpleClassName}`
          );
        }
        
        // Replace dots in class names with underscores for mermaid compatibility
        const relationshipRegex = /([A-Za-z0-9._]+)\s+(".*?")\s+--\s+(".*?")\s+([A-Za-z0-9._]+)\s+:\s+(.*)/g;
        while ((match = relationshipRegex.exec(code)) !== null) {
          const firstClass = match[1];
          const firstMultiplicity = match[2];
          const secondMultiplicity = match[3];
          const secondClass = match[4];
          const label = match[5];
          
          // Extract simple class names
          const firstClassParts = firstClass.split('.');
          const firstSimpleClass = firstClassParts[firstClassParts.length - 1];
          
          const secondClassParts = secondClass.split('.');
          const secondSimpleClass = secondClassParts[secondClassParts.length - 1];
          
          // Replace the full relationship line
          const originalLine = `${firstClass} ${firstMultiplicity} -- ${secondMultiplicity} ${secondClass} : ${label}`;
          const newLine = `${firstSimpleClass} ${firstMultiplicity} -- ${secondMultiplicity} ${secondSimpleClass} : ${label}`;
          
          fixedCode = fixedCode.replace(originalLine, newLine);
        }
      } 
      else if (type === 'ER Diagram' || type.toLowerCase().includes('er')) {
        // Remove nullable type markers which aren't supported in Mermaid ER diagrams
        fixedCode = fixedCode.replace(/string\?/g, "string")
                      .replace(/int\?/g, "int")
                      .replace(/double\?/g, "double")
                      .replace(/DateTime\?/g, "DateTime")
                      .replace(/bool\?/g, "bool");
      } 
      else if (type === 'Sequence Diagram' || type === 'Use Case Diagram' || 
               type.toLowerCase().includes('flow') || type.toLowerCase().includes('sequence')) {
        // Fix missing arrows in Actor connections
        fixedCode = fixedCode.replace(/([A-Za-z]+Actor)\s+--\s+([A-Z][0-9])/g, "$1 --> $2");
      }
      
      return fixedCode;
    };
    
    // Generate a simplified diagram based on type
    const generateSimplifiedDiagram = (type) => {
      if (type === 'Class Diagram' || type.toLowerCase().includes('class')) {
        return `
classDiagram
  class User {
    string id
    string name
    string email
  }
  class Product {
    string id
    string name
    string description
    double price
  }
  class Order {
    string id
    string userId
    dateTime createdAt
    double total
  }
  class OrderItem {
    string id
    string orderId
    string productId
    int quantity
    double price
  }
  
  User "1" -- "n" Order : places
  Order "1" -- "n" OrderItem : contains
  OrderItem "n" -- "1" Product : references
`;
      } 
      else if (type === 'ER Diagram' || type.toLowerCase().includes('er')) {
        return `
erDiagram
  USER {
    string id PK
    string name
    string email
  }
  PRODUCT {
    string id PK
    string name
    double price
  }
  ORDER {
    string id PK
    string userId FK
    dateTime createdAt
  }
  ORDER_ITEM {
    string id PK
    string orderId FK
    string productId FK
    int quantity
  }
  
  USER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : "ordered in"
`;
      } 
      else if (type === 'Sequence Diagram' || type.toLowerCase().includes('sequence')) {
        return `
sequenceDiagram
  participant User
  participant API
  participant Database
  
  User->>API: Request resource
  API->>Database: Query data
  Database-->>API: Return results
  API-->>User: Return formatted response
`;
      } 
      else if (type === 'Use Case Diagram' || type.toLowerCase().includes('use case')) {
        return `
flowchart TD
  subgraph System
    UC1[Login]
    UC2[View Items]
    UC3[Add to Cart]
    UC4[Checkout]
  end
  
  User((User))
  Admin((Admin))
  
  User --> UC1
  User --> UC2
  User --> UC3
  User --> UC4
  Admin --> UC1
  Admin --> UC2
`;
      }
      else {
        // Default flowchart
        return `
flowchart TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Process 1]
  B -->|No| D[Process 2]
  C --> E[End]
  D --> E
`;
      }
    };

    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => clearTimeout(timer);
  }, [diagramCode, diagramType]);

  // Apply zoom level when diagram is rendered
  useEffect(() => {
    if (isRendered && diagramContainerRef.current) {
      const svgElement = diagramContainerRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `scale(${zoom / 100})`;
        svgElement.style.transformOrigin = 'center top';
      }
    }
  }, [zoom, isRendered]);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Handle diagram download
  const handleDownload = async (format = 'png') => {
    setIsDownloading(true);
    setDropdownOpen(false); // Close dropdown after selection
    
    try {
      const svgElement = diagramContainerRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('No diagram to download');
      }

      // Create a clean filename from diagram type
      const fileName = `${diagramType.replace(/\s+/g, '-').toLowerCase()}-diagram`;

      if (format === 'svg') {
        // Clone the SVG to manipulate it safely
        const clonedSvg = svgElement.cloneNode(true);
        
        // Set proper dimensions - use the viewBox if available, or getBoundingClientRect
        const viewBox = svgElement.getAttribute('viewBox');
        const rect = svgElement.getBoundingClientRect();
        
        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          clonedSvg.setAttribute('width', vbWidth);
          clonedSvg.setAttribute('height', vbHeight);
        } else {
          clonedSvg.setAttribute('width', rect.width);
          clonedSvg.setAttribute('height', rect.height);
        }
        
        // Remove any transformation applied for zooming
        clonedSvg.style.transform = '';
        
        // Convert to string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        
        // Create a blob and download it
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        downloadBlob(svgBlob, `${fileName}.svg`);
      } 
      else if (format === 'png') {
        // For PNG, we'll create and render the entire SVG properly
        
        // First, get the original SVG's dimensions from its viewBox or computed values
        const viewBox = svgElement.getAttribute('viewBox');
        let svgWidth, svgHeight;
        
        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          svgWidth = vbWidth;
          svgHeight = vbHeight;
        } else {
          // If no viewBox, get the natural dimensions of the SVG
          // We'll use computed styles and the full scroll dimensions
          const computedStyle = window.getComputedStyle(svgElement);
          svgWidth = parseInt(computedStyle.width, 10);
          svgHeight = parseInt(computedStyle.height, 10);
          
          // If the SVG is larger than what's visible, use the scroll dimensions
          if (svgElement.scrollWidth > svgWidth) svgWidth = svgElement.scrollWidth;
          if (svgElement.scrollHeight > svgHeight) svgHeight = svgElement.scrollHeight;
        }

        // Create a temporary container to hold a clean copy of the SVG
        // This is necessary to avoid affecting the displayed SVG
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Clone the SVG and remove any transformations
        const clonedSvg = svgElement.cloneNode(true);
        clonedSvg.style.transform = '';
        clonedSvg.setAttribute('width', svgWidth);
        clonedSvg.setAttribute('height', svgHeight);
        
        // Add the cloned SVG to the temp container
        tempContainer.appendChild(clonedSvg);
        
        // Use html-to-image library approach by creating a data URL
        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const svgURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        
        // Create an image from the SVG data URL
        const img = new Image();
        img.onload = () => {
          // Create a canvas large enough for the entire diagram
          const canvas = document.createElement('canvas');
          
          // Set canvas dimensions to match the SVG's actual dimensions
          // We'll use a 2x scale factor for better quality
          canvas.width = svgWidth * 2;
          canvas.height = svgHeight * 2;
          
          const ctx = canvas.getContext('2d');
          ctx.scale(2, 2); // Scale up for better quality
          
          // Fill with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image
          ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
          
          // Convert to PNG and download
          canvas.toBlob((blob) => {
            if (blob) {
              downloadBlob(blob, `${fileName}.png`);
            } else {
              throw new Error('Failed to create PNG blob');
            }
            
            // Clean up the temporary container
            document.body.removeChild(tempContainer);
            setIsDownloading(false);
          }, 'image/png');
        };
        
        img.onerror = (error) => {
          console.error('Error loading SVG for conversion:', error);
          document.body.removeChild(tempContainer);
          setIsDownloading(false);
          alert('Error converting diagram to PNG. Please try SVG format instead.');
        };
        
        img.src = svgURL;
        return; // Early return since the rest happens in callbacks
      }
    } catch (error) {
      console.error('Error downloading diagram:', error);
      alert('Error downloading diagram. Please try again.');
    }
    
    setIsDownloading(false);
  };

  // Helper function to download a blob
  const downloadBlob = (blob, fileName) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="diagram-viewer">
      <div className="diagram-header">
        <h3 className="diagram-title">{diagramType}</h3>
        <div className="diagram-controls">
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">−</button>
            <span className="zoom-level">{zoom}%</span>
            <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">+</button>
            <button className="zoom-reset-btn" onClick={handleZoomReset} title="Reset Zoom">Reset</button>
          </div>
          <div className="download-controls" ref={dropdownRef}>
            <button 
              className="download-btn" 
              disabled={isDownloading || !isRendered}
              onClick={toggleDropdown}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
            {dropdownOpen && (
              <div className="dropdown-content show">
                <button onClick={() => handleDownload('png')}>PNG Image</button>
                <button onClick={() => handleDownload('svg')}>SVG Vector</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="diagram-container" ref={diagramContainerRef}></div>
    </div>
  );
};

export default DiagramViewer;