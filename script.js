// Race data
const races = [
    "A1",
    "Blue",
    "White", 
    "Red", 
    "Green",
];

// Driver data with their times (in seconds)
const driversData = {
    mercedes: [
        {
            name: "MJ",
            number: 44,
            times: [
                1.000, // Times will be generated randomly at runtime
                1.000,
                1.000,
                1.000,
                1.000
            ]
        },
        {
            name: "George Russell",
            number: 63,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        },
        {
            name: "Valtteri Bottas",
            number: 77,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        },
        {
            name: "Esteban Ocon",
            number: 31,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        },
        {
            name: "Andrea Kimi Antonelli",
            number: 87,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        }
    ],
    redBull: [
        {
            name: "Max Verstappen",
            number: 1,
            times: [
                1.000, // Times will be generated randomly at runtime
                1.000,
                1.000,
                1.000,
                1.000
            ]
        },
        {
            name: "Sergio Perez",
            number: 11,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        },
        {
            name: "Daniel Ricciardo",
            number: 3,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        },
        {
            name: "Yuki Tsunoda",
            number: 22,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        },
        {
            name: "Liam Lawson",
            number: 15,
            times: [
                0.000, // Times will be generated randomly at runtime
                0.000,
                0.000,
                0.000,
                0.000
            ]
        }
    ]
};

// Team data
const teamsData = [
    {
        name: "Mercedes",
        logo: "https://www.formula1.com/content/dam/fom-website/teams/2023/mercedes.png.transform/2col/image.png",
        cssClass: "mercedes",
        drivers: driversData.mercedes
    },
    {
        name: "Red Bull",
        logo: "https://www.formula1.com/content/dam/fom-website/teams/2023/red-bull-racing.png.transform/2col/image.png",
        cssClass: "redbull",
        drivers: driversData.redBull
    }
];

// Generate random lap times between 1:20.000 and 1:45.999
// Returns 0 occasionally to represent DNF (Did Not Finish)
function generateRandomTime() {
    // 5% chance of DNF (Did Not Finish)
    if (Math.random() < 0.05) {
        return 0;
    }
    
    // Random time between 80 and 105.999 seconds
    const seconds = 80 + Math.random() * 25.999;
    return parseFloat(seconds.toFixed(3));
}

// Format time as minutes:seconds.milliseconds or "DNF"
function formatTime(seconds) {
    if (seconds === 0) {
        return "DNF";
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3).padStart(6, '0');
    return `${minutes}:${remainingSeconds}`;
}

// Generate race data
function generateRaceData() {
    // Generate times for each driver in each race
    teamsData.forEach(team => {
        team.drivers.forEach(driver => {
            // Fill in random times for each race
            for (let i = 0; i < races.length; i++) {
                //driver.times[i] = generateRandomTime();
            }
            
            // Calculate total time for driver (excluding DNFs)
            driver.totalTime = driver.times.reduce((sum, time) => sum + (time > 0 ? time : 0), 0);
            
            // Count number of DNFs
            driver.dnfCount = driver.times.filter(time => time === 0).length;
        });
        
        // Calculate team totals
        team.totalTime = team.drivers.reduce((sum, driver) => sum + driver.totalTime, 0);
        team.dnfCount = team.drivers.reduce((sum, driver) => sum + driver.dnfCount, 0);
    });
    
    // Find best times for each race and team (ignoring DNFs)
    races.forEach((race, raceIndex) => {
        teamsData.forEach(team => {
            // Get all valid times (non-zero) for this race
            const validTimes = team.drivers
                .map(driver => driver.times[raceIndex])
                .filter(time => time > 0);
            
            // Find the best time among valid times
            const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null;
            
            // Mark best times
            team.drivers.forEach(driver => {
                if (!driver.bestTimes) {
                    driver.bestTimes = new Array(races.length).fill(false);
                }
                
                // A time is best only if it's valid and equals the best time
                driver.bestTimes[raceIndex] = 
                    driver.times[raceIndex] > 0 && 
                    bestTime !== null && 
                    driver.times[raceIndex] === bestTime;
            });
        });
    });
    
    // Determine the winner
    const winner = teamsData.reduce((a, b) => a.totalTime < b.totalTime ? a : b);
    teamsData.forEach(team => {
        team.isWinner = team.name === winner.name;
    });
}

// Render the teams and race data
function renderData() {
    const teamsContainer = document.getElementById('teams-container');
    teamsContainer.innerHTML = '';
    
    teamsData.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = `team ${team.isWinner ? 'winner-team' : ''}`;
        
        // Table with driver positions
        let driverRows = '';
        
        // Sort drivers by their total time for rankings
        const sortedDrivers = [...team.drivers].sort((a, b) => a.totalTime - b.totalTime);
        
        sortedDrivers.forEach((driver, index) => {
            driverRows += `
                <tr>
                    <td>
                        <div class="driver-info">
                            <span class="driver-number">${driver.number}</span>
                            <span class="driver-name">${driver.name}</span>
                        </div>
                    </td>
                    ${driver.times.map((time, idx) => `
                        <td class="${driver.bestTimes[idx] ? 'best-time' : ''}">${formatTime(time)}</td>
                    `).join('')}
                    <td class="driver-total">${formatTime(driver.totalTime)}</td>
                </tr>
            `;
        });
        
        teamElement.innerHTML = `
            <div class="team-header">
                <img src="${team.logo}" alt="${team.name} logo" class="team-logo">
                <h2 class="team-name ${team.cssClass}">${team.name}</h2>
            </div>
            
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Driver</th>
                            ${races.map(race => `<th>${race}</th>`).join('')}
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${driverRows}
                    </tbody>
                </table>
                <div class="table-scroll-hint">← Scroll →</div>
            </div>
            
            <div class="team-total ${team.isWinner ? 'winner' : ''}">
                Total Team Time: ${formatTime(team.totalTime)} ${team.isWinner ? '🏆 WINNERS!' : ''}
            </div>
        `;
        
        teamsContainer.appendChild(teamElement);
    });
    
    // Update results text
    const resultsText = document.getElementById('results-text');
    const winner = teamsData.find(team => team.isWinner);
    const second = teamsData.find(team => !team.isWinner);
    
    const timeDiff = Math.abs(second.totalTime - winner.totalTime);
    
    resultsText.innerHTML = `
        <div class="f1-results">
            <div class="results-card winner-card">
                <div class="position">1</div>
                <div class="team-details">
                    <img src="${winner.logo}" alt="${winner.name}" class="small-logo">
                    <div class="team-name ${winner.cssClass}">${winner.name}</div>
                </div>
                <div class="time-details">
                    <div class="total-time">${formatTime(winner.totalTime)}</div>
                </div>
            </div>
            <div class="results-card">
                <div class="position">2</div>
                <div class="team-details">
                    <img src="${second.logo}" alt="${second.name}" class="small-logo">
                    <div class="team-name ${second.cssClass}">${second.name}</div>
                </div>
                <div class="time-details">
                    <div class="total-time">${formatTime(second.totalTime)}</div>
                    <div class="time-delta">+${formatTime(timeDiff)}</div>
                </div>
            </div>
        </div>
    `;
    
    // Check and indicate if tables are scrollable
    checkTableScrollability();
    
    // Create visualization with D3
    createVisualization();
}

// Function to check if tables are scrollable and show/hide the hint accordingly
function checkTableScrollability() {
    const tableWrappers = document.querySelectorAll('.table-wrapper');
    tableWrappers.forEach(wrapper => {
        const table = wrapper.querySelector('table');
        const hint = wrapper.querySelector('.table-scroll-hint');
        
        // Show hint only if table is wider than its container
        if (table.scrollWidth > wrapper.clientWidth) {
            hint.style.display = 'block';
        } else {
            hint.style.display = 'none';
        }
    });
}

// Create visualization using D3.js
function createVisualization() {
    // Clear previous chart
    d3.select("#chart-container").html("");
    
    const width = document.getElementById('chart-container').clientWidth;
    const isMobile = window.innerWidth <= 800;
    const height = isMobile ? 280 : 350;
    
    // Adjust margins for mobile
    const margin = isMobile 
        ? { top: 30, right: 20, bottom: 70, left: 40 } 
        : { top: 30, right: 30, bottom: 70, left: 80 };
    
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Prepare data for visualization - filter out DNF times
    const chartData = [];
    teamsData.forEach(team => {
        team.drivers.forEach(driver => {
            driver.times.forEach((time, idx) => {
                if (time > 0) { // Only include valid times (not DNFs)
                    chartData.push({
                        team: team.name,
                        driver: driver.name,
                        race: races[idx],
                        time: time,
                        isBest: driver.bestTimes[idx],
                        raceIndex: idx,
                        cssClass: team.cssClass
                    });
                }
            });
        });
    });
    
    // X axis
    const x = d3.scaleBand()
        .domain(races)
        .range([0, width - margin.left - margin.right])
        .padding(0.2);
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", isMobile ? "rotate(-40)" : "rotate(-25)")
        .style("font-size", isMobile ? "8px" : "11px");
    
    // Y axis - ensure we don't include 0 values in domain calculation
    const validTimes = chartData.map(d => d.time);
    const minTime = validTimes.length > 0 ? Math.max(70, Math.min(...validTimes) - 5) : 70;
    const maxTime = validTimes.length > 0 ? Math.max(...validTimes) + 5 : 110;
    
    const y = d3.scaleLinear()
        .domain([minTime, maxTime])
        .range([height - margin.top - margin.bottom, 0]);
    
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y)
            .tickFormat(d => formatTime(d))
            .ticks(isMobile ? 4 : 8)); // Fewer ticks on mobile
    
    // Add title
    if (!isMobile) {
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", "#15151e")
            .text("Best Lap Times by Race");
    }
    
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(teamsData.map(t => t.name))
        .range(["#00d2be", "#0600ef"]);
    
    // Filter for just the best times for each team
    const bestTimes = chartData.filter(d => d.isBest);
    
    // Add grid lines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-(width - margin.left - margin.right))
            .tickFormat("")
            .ticks(isMobile ? 4 : 8)
        )
        .style("stroke", "#f1f1f1")
        .style("opacity", 0.7);
    
    // Add lines - special handling to not connect points with DNF in between
    teamsData.forEach(team => {
        const teamBestTimes = bestTimes.filter(d => d.team === team.name)
            .sort((a, b) => a.raceIndex - b.raceIndex);
        
        // Custom line generator that handles disconnected segments
        const lineSegments = [];
        let currentSegment = [];
        
        // Group into continuous segments (for races with no DNFs)
        for (let i = 0; i < races.length; i++) {
            const point = teamBestTimes.find(d => d.raceIndex === i);
            
            if (point) {
                // We have a valid point for this race
                currentSegment.push(point);
            } else if (currentSegment.length > 0) {
                // No valid point - break the line
                lineSegments.push([...currentSegment]);
                currentSegment = [];
            }
        }
        
        // Add the last segment if it has points
        if (currentSegment.length > 0) {
            lineSegments.push(currentSegment);
        }
        
        // Generate path for each segment
        const lineGenerator = d3.line()
            .x(d => x(d.race) + x.bandwidth() / 2)
            .y(d => y(d.time))
            .curve(d3.curveMonotoneX);
        
        lineSegments.forEach(segment => {
            if (segment.length > 1) {
                svg.append("path")
                    .datum(segment)
                    .attr("fill", "none")
                    .attr("stroke", color(team.name))
                    .attr("stroke-width", isMobile ? 2 : 3)
                    .attr("d", lineGenerator)
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 0.8);
            }
        });
    });
    
    // Add dots for best times
    svg.selectAll(".best-time-dot")
        .data(bestTimes)
        .join("circle")
        .attr("class", "best-time-dot")
        .attr("cx", d => x(d.race) + x.bandwidth() / 2)
        .attr("cy", d => y(d.time))
        .attr("r", 0)
        .attr("fill", d => color(d.team))
        .style("stroke", "#ffffff")
        .style("stroke-width", isMobile ? 1 : 2)
        .transition()
        .delay((d, i) => i * 100)
        .duration(1000)
        .attr("r", isMobile ? 5 : 6);
    
    // Add team names if we have points for the last race and not on mobile
    if (!isMobile) {
        const lastRacePoints = bestTimes.filter(d => d.raceIndex === races.length - 1);
        
        svg.selectAll(".team-label")
            .data(lastRacePoints)
            .join("text")
            .attr("class", "team-label")
            .attr("x", d => x(d.race) + x.bandwidth() / 2 + 10)
            .attr("y", d => y(d.time))
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", d => color(d.team))
            .style("opacity", 0)
            .text(d => d.team)
            .transition()
            .delay(1500)
            .duration(500)
            .style("opacity", 1);
    }
    
    // Style axes
    svg.selectAll(".x-axis path, .y-axis path")
        .style("stroke", "#ccc");
    
    svg.selectAll(".x-axis line, .y-axis line")
        .style("stroke", "#eee");
        
    svg.selectAll(".x-axis text, .y-axis text")
        .style("fill", "#666")
        .style("font-size", isMobile ? "8px" : "11px");
    
    // Add tooltip functionality
    const tooltip = d3.select("#chart-container")
        .append("div")
        .attr("class", "f1-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(255, 255, 255, 0.95)")
        .style("border", "1px solid #e0e0e0")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "#15151e")
        .style("font-size", isMobile ? "10px" : "12px")
        .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)")
        .style("z-index", "1000")
        .style("max-width", isMobile ? "200px" : "auto");
    
    svg.selectAll(".best-time-dot")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", isMobile ? 8 : 9);
            
            tooltip
                .style("visibility", "visible")
                .html(`
                    <div style="font-weight: 700; color: ${color(d.team)};">${d.team}</div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Driver:</span> ${d.driver}
                    </div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Race:</span> ${d.race}
                    </div>
                    <div style="font-weight: 700; margin-top: 5px;">
                        Time: ${formatTime(d.time)}
                    </div>
                `);
                
            // Position the tooltip based on available space
            const tooltipNode = tooltip.node();
            const tooltipRect = tooltipNode.getBoundingClientRect();
            const chartRect = document.getElementById('chart-container').getBoundingClientRect();
                
            // Calculate positions
            let left = event.pageX + 10;
            let top = event.pageY - 20;
                
            // Ensure tooltip stays within the chart container horizontally
            if (left + tooltipRect.width > chartRect.right) {
                left = event.pageX - tooltipRect.width - 10;
            }
                
            // Ensure tooltip stays within the chart container vertically
            if (top + tooltipRect.height > chartRect.bottom) {
                top = event.pageY - tooltipRect.height - 10;
            }
                
            tooltip
                .style("left", left + "px")
                .style("top", top + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", isMobile ? 5 : 6);
            
            tooltip.style("visibility", "hidden");
        });
        
    // Add improved touch event support for mobile
    if ('ontouchstart' in window) {
        // Clear any existing touch events to prevent duplications
        svg.selectAll(".best-time-dot")
            .on("touchstart", null)
            .on("touchend", null);
        
        svg.selectAll(".best-time-dot")
            .on("touchstart", function(event, d) {
                event.preventDefault();
                
                // Hide any previously visible tooltips
                tooltip.style("visibility", "hidden");
                
                // Reset all dots to normal size
                svg.selectAll(".best-time-dot")
                    .transition()
                    .duration(200)
                    .attr("r", isMobile ? 5 : 6);
                
                // Enlarge this dot
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 8);
                
                tooltip
                    .style("visibility", "visible")
                    .html(`
                        <div style="font-weight: 700; color: ${color(d.team)};">${d.team}</div>
                        <div style="margin: 5px 0;">
                            <span style="font-weight: 600;">Driver:</span> ${d.driver}
                        </div>
                        <div style="margin: 5px 0;">
                            <span style="font-weight: 600;">Race:</span> ${d.race}
                        </div>
                        <div style="font-weight: 700; margin-top: 5px;">
                            Time: ${formatTime(d.time)}
                        </div>
                    `);
                
                // Position the tooltip appropriately for touch
                const touch = event.touches[0];
                const tooltipNode = tooltip.node();
                const tooltipRect = tooltipNode.getBoundingClientRect();
                const chartRect = document.getElementById('chart-container').getBoundingClientRect();
                
                // Calculate positions with better touch positioning
                let left = touch.pageX - (tooltipRect.width / 2);
                let top = touch.pageY - tooltipRect.height - 20;
                
                // Ensure tooltip stays within the chart container
                if (left < chartRect.left) {
                    left = chartRect.left + 5;
                } else if (left + tooltipRect.width > chartRect.right) {
                    left = chartRect.right - tooltipRect.width - 5;
                }
                
                if (top < chartRect.top) {
                    top = touch.pageY + 20; // Position below the finger
                }
                
                tooltip
                    .style("left", left + "px")
                    .style("top", top + "px");
            });
            
        // Add a tap-away listener to dismiss tooltip
        d3.select("body")
            .on("touchstart", function(event) {
                // Check if the touch is not on a dot
                const isOnDot = d3.select(event.target).classed("best-time-dot");
                if (!isOnDot) {
                    // Reset all dots and hide tooltip
                    svg.selectAll(".best-time-dot")
                        .transition()
                        .duration(200)
                        .attr("r", isMobile ? 5 : 6);
                    
                    tooltip.style("visibility", "hidden");
                }
            });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateRaceData();
    renderData();
    
    // Add responsive behavior for chart
    window.addEventListener('resize', () => {
        createVisualization();
        checkTableScrollability();
    });
    
    // Add horizontal scrolling hint listener
    if ('ontouchstart' in window) {
        const tableWrappers = document.querySelectorAll('.table-wrapper');
        tableWrappers.forEach(wrapper => {
            // Fade out scroll hint after first scroll
            wrapper.addEventListener('scroll', function scrollHandler() {
                const hint = wrapper.querySelector('.table-scroll-hint');
                setTimeout(() => {
                    hint.style.opacity = '0.5';
                    setTimeout(() => {
                        hint.style.opacity = '0';
                    }, 1000);
                }, 500);
                wrapper.removeEventListener('scroll', scrollHandler);
            });
        });
    }
});
